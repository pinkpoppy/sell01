jQuery(document).ready(function($) {
  var 
    userData = function jointUserinfo() {
      var userinfo = app.methods.getBasicUserinfo()
      if (arguments.length == 1) {
        userinfo['goods'] = arguments[0]

      } else if (arguments.length==2) {//调用updateCart接口
        userinfo['gid'] = arguments[0]
        userinfo['quantity'] = arguments[1]
      } else if (arguments.length == 3) { //删除酒款
        userinfo['gid'] = arguments[0]
      }
      console.log(JSON.stringify(userinfo))
      return JSON.stringify(userinfo) 
    }
    cachedGoods = {}//将用户购物车中得物品cache住，随着购物车数量更新而更新
  app.methods.appAjax("获取用户购物车列表",
    "cart",
    "POST",
    userData(),
    app.methods.timestamp(),
    getCartSucceed,
    getCartFailed)

  function insertDom(data){
    var 
      $wrap = $('.swipe-delete')
      defaultTotalCost = 0

    for (var i= 0, l = data.length; i < l; i++) {
      cachedGoods[data[i]['id']] = data[i]['quantity']
      //TODO 列表点击后的跳转,先不做
      var
        currentGoodsCost = parseInt(data[i]['quantity']) * parseFloat(data[i]['price'])
        defaultTotalCost += currentGoodsCost
        $list = $("<li data-id='"+data[i]['id']+"'>"
                    +"<div>"
                      +"<div class='behind'>"
                        +"<a href='#'>删除</a>"
                      +"</div>"
                      +"<input type='radio' class='goods-choosen'>"
                      +"<img src='"+data[i]['pics'][0]['pic']+"' class='cart-wine-pic'>"
                      +"<div class='cont-right'>"
                        +"<div class='list-wine-title'>"+data[i]['title']+"</div><br>"
                        +"<span class='list-wine-inventory'>"+data[i]['inventory']+"</span><br>"
                        +"<span class='list-wine-price' data-price='"+data[i]['price']+"'>"+data[i]['price']+'&yen;'+"</span>"
                        +"<button class='cart-minus-op'>-</button>"
                        +"<span class='list-wine-num'>"+data[i]['quantity']+"</span>"
                        +"<button class='cart-plus-op'>+</button>"
                      +"</div>"
                    +"</div>"
                  +"</li>")
      
      $wrap.append($list)
    }
    //进入购物车页面时，默认选中所有商品，总价值已经计算出来
    $('#total').text(defaultTotalCost)

    $('.cart-minus-op').on('click',function(event) {
        var
          gid = $(this).parent().parent().parent().attr('data-id')
          originalVal = parseInt($(this).next().text())
          self = $(this).next()

        if (originalVal == 1) {
          alert("确认删除该商品吗?")
          //YES TODO call delCart
          function deleteSucceed(data){
            if (data['state']==1) {
              // $(".listview > li[data-id='3']").remove()
              $("li[data-id='3']").remove()
              alert("删除成功")
            }
          }
          function deleteFailed(data){
            if (data['state'] == 0)
              alert("删除失败")
          }
          app.methods.appAjax("删除商品",
                              "delCart",
                              "POST",
                              userData(gid,'del','del'),
                              app.methods.timestamp(),
                              deleteSucceed,
                              deleteFailed)
          //NO TODO nothing  
        }

        app.methods.appAjax("购物车数量减1",
                            "updateCart",
                            'POST',
                            userData(gid,-1),
                            app.methods.timestamp(),
                            function() {
                              var 
                                originalVal = parseInt($(self).text())
                                prevTotal = parseFloat($('#total').text())//上一次总价钱
                              $(self).text(--originalVal)
                              var price = -(parseFloat($(self).prev().prev().text()))//单价
                              $('#total').text(price + prevTotal)
                              cachedGoods[gid] = parseInt(cachedGoods[gid]) - 1
                            },
                            function(){
                              alert("减少数量失败,请重试")
                            })
      });

      $('.cart-plus-op').on('click',function(event) {
        var
          gid = $(this).parent().parent().parent().attr('data-id')
          originalVal = parseInt($(this).prev().text())
          self = $(this).prev()

        app.methods.appAjax("购物车数量加1",
                            "updateCart",
                            'POST',
                            userData(gid,1),
                            app.methods.timestamp(),
                            function() {
                              var 
                                originalVal = parseInt($(self).text())
                                prevTotal = parseFloat($('#total').text())//上一次总价钱
                              $(self).text(++originalVal)
                              var price = parseFloat($(self).prev().prev().attr('data-price'))
                              $('#total').text(price + prevTotal)
                              cachedGoods[gid] = parseInt(cachedGoods[gid]) + 1
                            },
                            function(){
                              alert("增加数量失败,请重试")
                            })

      });
  }

  

  function getCartSucceed(response){
    //TODO if 购物车没有商品,展示那个空白页面
    insertDom(response['goods'])
  }

  function getCartFailed(response){

  }

  //结算
  $('#checkout').click(function(){
    app.methods.appAjax('结算请求',
                        'placeOrder',
                        'POST',
                        userData(cachedGoods),
                        app.methods.timestamp(),
                        function(data){
                          //TODO 请求成功，跳转到订单页面
                          afterPay(data)
                        },
                        function(data){
                          //TODO 请求结算失败，留在购物车页面，要求重试
                          afterPay(data)
                        })
  });
  
  function afterPay(data) {
    if (data['msg']=="库存不足" || data['state']=="0") {
      var shortageGoods = data['goods']
      for (var i=0,l = shortageGoods.length; i<l; i++) {
        $(".listview").filter(function(index,ele) {
          if ($(this).attr('id') == shortageGoods[i]['id']) {
            $(this).attr('id', shortageGoods[i]['id'])
          }
          return
        })
      }
      alert("库存不足，请重新选择数量")
    } else if (data['state'] == 1) {
      //库存没有问题.可以提交订单,服务器返回订单编号,到下一个页面再用订单编号去获取订单详情
      //页面跳转
      (function(order){
        location.href = "placeOrder.html?order=" + order['order_no']
      })(data['order'])
    }
  }
  // swipe to delete partial start
  function prevent_default(e) {
    e.preventDefault();
  }

  function disable_scroll() {
    $(document).on('touchmove', prevent_default);
  }

  function enable_scroll() {
    $(document).unbind('touchmove', prevent_default)
  }

  var x

  $('.swipe-delete li > a')
  .on('touchstart', function(e) {
    $('.swipe-delete li > a.open').css('left', '0px').removeClass('open')
    $(e.currentTarget).addClass('open')
    x = e.originalEvent.targetTouches[0].pageX 
  })
  .on('touchmove', function(e) {
    var change = e.originalEvent.targetTouches[0].pageX - x
    change = Math.min(Math.max(-100, change), 100) 
    e.currentTarget.style.left = change + 'px'
    if (change < -10) disable_scroll() 
  })
  .on('touchend', function(e) {
    var left = parseInt(e.currentTarget.style.left)
    var new_left;
    if (left < -35) {
      new_left = '-100px'
    } else if (left > 35) {
      new_left = '100px'
    } else {
      new_left = '0px'
    }
    $(e.currentTarget).animate({left: new_left}, 200)
    enable_scroll()
  });

  $('li .delete-btn').on('touchend', function(e) {
    e.preventDefault()
    $(this).parents('li').slideUp('fast', function() {
      $(this).remove()
    })
  })
  // swipe to delete partial end
});