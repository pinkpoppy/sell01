jQuery(document).ready(function($) {
  var 
  userData = function jointUserinfo() {
    var userinfo = app.methods.getBasicUserinfo()
    if (arguments.length==2) {//调用updateCart接口
      userinfo['gid'] = arguments[0]
      userinfo['quantity'] = arguments[1]
    } 
    return JSON.stringify(userinfo) 
  }
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
    
  });
  
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