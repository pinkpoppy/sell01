jQuery(document).ready(function($) {
  app.methods.setModalMask($('.modal-wrap'))
  var
    loginConfig = {
      'EMPTY' : '手机号不能为空',
      'telNotValid' : '请输入有效的手机号码'
    }
  var 
    userData = function jointUserinfo() {
      var userinfo = app.methods.getBasicUserinfo()
      if (arguments.length == 1) {
        userinfo['goods'] = arguments[0]
        userinfo['form'] = "wxfwh"
      } else if (arguments.length==2) {

        //调用updateCart接口
        userinfo['gid'] = arguments[0]
        userinfo['quantity'] = arguments[1]
      } else if (arguments.length == 3) { //删除酒款
        userinfo['gid'] = arguments[0]
      } else if (arguments.length == 4) {
        userinfo['mp'] = arguments[0]
        userinfo['type'] = arguments[1]
      } else if (arguments.length == 5) {
        //验证验证码
        userinfo['mp'] = arguments[0]
        userinfo['code'] = arguments[1]
      }
      console.log(JSON.stringify(userinfo))
      return JSON.stringify(userinfo) 
    }
    cachedGoods = {}//将用户购物车中得物品cache住，随着购物车数量更新而更新
    totalGoodsCnt = 0
    defaultTotalCost = 0
    chooseCnt = 0
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
    for (var i= 0, l = data.length; i < l; i++) {
      cachedGoods[data[i]['id']] = data[i]['quantity']
      totalGoodsCnt += data[i]['quantity']
      ++chooseCnt
      //TODO 列表点击后的跳转,先不做
      var
        currentGoodsCost = parseInt(data[i]['quantity']) * parseFloat(data[i]['price'])
        defaultTotalCost += currentGoodsCost
        $list = $("<li data-id='"+data[i]['id']+"'>"
                    +"<div>"
                      +"<input type='button' class='goods-choosen'>"
                      +"<img src='"+data[i]['pics'][0]['pic']+"' class='cart-wine-pic'>"
                      +"<div class='cont-right'>"
                        +"<div class='list-wine-title'>"+data[i]['title']+"</div><br>"
                        +"<span>库存</span><span class='list-wine-inventory'>"+data[i]['inventory']+"</span><br>"
                        +"<span>&yen;</span>"
                        +"<span class='list-wine-price' data-price='"+data[i]['price']+"'>"+data[i]['price']+"</span>"
                        +"<button class='cart-minus-op op'>-</button>"
                        +"<span class='list-wine-num'>"+data[i]['quantity']+"</span>"
                        +"<button class='cart-plus-op op'>+</button>"
                      +"</div>"
                    +"</div>"
                  +"</li>")
      
      $wrap.append($list)
    }

    $('#checkout').text('去结算('+totalGoodsCnt+')')
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
              $("li[data-id='"+gid+"']").remove()
              alert("删除成功")
              //检查如果该用户购物车没有商品时，那么取消全选
              if($('.cont-right').length == 0) {
                var 
                  preBgUrl = $('#cart-all').css("backgroundImage")
                  newBgUrl = preBgUrl.replace('focus','blur')
                $('#cart-all').css("backgroundImage",newBgUrl)
              }
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

                              -- totalGoodsCnt //-1成功后,去结算按钮上数量-1
                              $('#checkout').text('去结算('+totalGoodsCnt+')')
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
        prevCnt = parseInt($(self).text())
        inventory = parseInt($(self).prev().prev().prev().prev().prev().text())
        if (prevCnt + 1 <= inventory) {
          app.methods.appAjax("购物车数量加1",
                          "updateCart",
                          'POST',
                          userData(gid,1),
                          app.methods.timestamp(),
                          function(data) {
                            if (data['state'] == 1) {
                              var 
                                originalVal = parseInt($(self).text())
                                prevTotal = parseFloat($('#total').text())//上一次总价钱
                              $(self).text(Math.min(++ originalVal,inventory))
                              var price = parseFloat($(self).prev().prev().attr('data-price'))
                              $('#total').text(price + prevTotal)
                              cachedGoods[gid] = parseInt(cachedGoods[gid]) + 1
                              ++totalGoodsCnt//+1成功后,去结算按钮上数量+1
                              $('#checkout').text('去结算('+totalGoodsCnt+')')
                            }
                          },
                          function(data){
                            console.log(data['msg'])
                            alert("增加数量失败,请重试")
                          })
        }
    });
    //取消or 选中某个商品
    $('.goods-choosen').on('click',function(event) {
      event.preventDefault();
      var
        prevBgUrl = $(this).css('background-image')
      bgUrl = app.methods.setBgImage(prevBgUrl)
      $(this).css('backgroundImage', bgUrl)

      if ($(this).attr('id')=='cart-all') {//按下的是全选按钮
        $('.goods-choosen').css('backgroundImage', bgUrl)
        defaultTotalCost = 0
        totalGoodsCnt = 0
        if (prevBgUrl.search('focus') == -1) {//按下全选的时候是全未选中状态
          chooseCnt = $('.cont-right').size()
          //选中全部商品 
          $('.cont-right').each(function(i, el) {
            var 
              market = parseInt($(this).children('.list-wine-price').attr('data-price'))
              quantity = 0
              if (market) {
                quantity = parseInt($(this).children('.list-wine-num').text())
                defaultTotalCost += market * quantity
                totalGoodsCnt += quantity
              }
          });
          $('#checkout').text("去结算("+totalGoodsCnt +")")
          $('#total').text(defaultTotalCost)
        } else if (prevBgUrl.search('blur') == -1) {
          chooseCnt = 0
          //取消选中全部 商品
          $('#checkout').text("去结算("+totalGoodsCnt +")")
          $('#total').text(defaultTotalCost)
        }
      } else {
        var
          l = parseInt($('.cont-right').size())
          price = parseInt($(this).siblings('.cont-right').children('.list-wine-price').text())
          quantity = parseInt($(this).siblings('.cont-right').children('.list-wine-num').text())
          console.log("price =" + price + " " + "quantity =" + quantity)
        if (prevBgUrl.search('focus')!=-1) {
          --chooseCnt
          var newUrl = prevBgUrl.replace('focus','blur')
          $('#cart-all').css('backgroundImage', newUrl);
          totalGoodsCnt -= quantity
          defaultTotalCost -= quantity * price
        } else if (prevBgUrl.search('blur') !=-1) {
          if (++chooseCnt == l) {
            var newUrl = prevBgUrl.replace('blur','focus')
            $('#cart-all').css('backgroundImage', newUrl);
          }
          totalGoodsCnt += quantity
          defaultTotalCost += quantity * price
        }
        console.log("totalGoodsCnt = " + totalGoodsCnt + " " + "defaultTotalCost = " + defaultTotalCost)
        $('#checkout').text("去结算("+totalGoodsCnt +")")
        $('#total').text(defaultTotalCost)
      }
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
    /* 检查三个点
      * (1)如果一个商品都没选择，弹出警告框让用户至少选择一个商品,静默处理(留在购物车页面)
      * (2)与Server 交互一次,确认选择数量 <= 库存数量
      * (2)检查是否绑定了手机号，如果没有，要求绑定，不绑定的话不允许提交
      * (3)
    */

    var hasChoosenGoods = (function(){
      var choosed = false
      $.each($('.goods-choosen'),function(index, el) {
        var imgBgUrl = $(el).css('backgroundImage')
        if (imgBgUrl.search('focus') != -1) {
          choosed = true
          return choosed
        }
      })
      return choosed
    })()
    if (!hasChoosenGoods) {
      alert("请至少选择一件商品")
      return 
    }
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
  
  function placeOrder(order) {
    console.log(order)
    location.href = "placeOrder.php?order=" + order['order_no']
  }

  function afterPay(data) {
    if (data['state']=='0') {
      if (data['msg']=="库存不足") {
        var shortageGoods = data['goods']
        for (var i=0,l = shortageGoods.length; i<l; i++) {
          $(".listview").filter(function(index,ele) {
            if ($(this).attr('id') == shortageGoods[i]['id']) {
              $(this).attr('id', shortageGoods[i]['id'])
            }
            return
          })
        }
        alert("库存不足，请重新选择商品数量")
      }  
    } else if (data['state'] == '1') {
      placeOrder(data['order'])
    } else if(data['state']=='2'){//弹出相应绑定页面 2000px
      $('.modal-wrap').show()
      $('.modal-wrap').animate({
          top:0
      },100,function() {})
      var 
        canSend = false
        telStr = ""
      $('#wx-tel-input').blur(function(event) { 
        telStr = $(this).val()
        var isLegal = app.methods.isLegalMobilePhone(telStr)
        if (isLegal) {
          if (isLegal == "EMPTY") {
            $('#wx-err-msg').text(loginConfig['EMPTY'])
            return
          } else {
            canSend = true
          }
        } else {
          $('#wx-err-msg').text(loginConfig['telNotValid'])
        } 
      });
    }
    
    $('#wx-send-code').click(function(event) {
      //向服务器请求验证码
      app.methods.appAjax('获取手机验证码',
                          'getCode',
                          'POST',
                          userData(telStr,'2','pl1','pl2'),
                          app.methods.timestamp(),
                          function(data){
                            if (data['state'] == 1) {
                              //服务器成功响应,客户顿开始倒计时
                              var 
                                s = 60
                                i = setInterval(function(){
                                      $('#wx-send-code').text(--s + 's')
                                    },1000)
                                setTimeout(function(){
                                  clearInterval(i)
                                  $('#wx-send-code').text("重新发送")
                                },60000)
                            }
                          })
    })
    $('#wx-confirm-binding').click(function(event) {
      //提交验证码
      var code = $('#bind-code-input').val()
      if (canSend) {
        if (code.length == 6) {
          app.methods.appAjax('提交验证码,绑定微信号',
                              'validCode',
                              'POST',
                              userData(telStr,code,'pl1','pl2','pl3'),
                              app.methods.timestamp(),
                              function(data){
                                console.log(data)
                                if (data['state'] == '1'){
                                  $('#wx-confirm-binding').text("绑定成功!正在生成订单...")
                                      app.methods.appAjax('结算请求',
                                                      'placeOrder',
                                                      'POST',
                                                      userData(cachedGoods),
                                                    app.methods.timestamp(),
                                              function(data){
                                                //TODO 请求成功，跳转到订单页面
                                                if (data['state'] == 1) {
                                                  placeOrder(data['order'])
                                                }
                                                //TODO 其他失败情况
                                                afterPay(data)
                                              })
                                  setTimeout(function(){
                                    placeOrder(data['order'])
                                  },2000)
                                } else if (data['state'] == '3') {
                                  $('#wx-err-msg').text("验证码错误,请检查")
                                }
                              })
        }
      }
    })
    $('#wx-modal-close').click(function(event) {
      $('.modal-wrap').animate({
        top: 2000},
        300, function() {
        $('.modal-wrap').hide()
      })
    })
  } 
});
