$(function(){
  var 
    orderId = app.methods.getSearchArgFromUrl()['order']
    userData = function jointUserinfo(arg) {
      var userinfo = app.methods.getBasicUserinfo()
      if (typeof arg ==="string") {
        userinfo['order_no'] = arg
      } else if (typeof arg === "object") {
        for (prop in arg) {
          if (arg.hasOwnProperty(prop)) {
            userinfo[prop] = unescape(encodeURIComponent(arg[prop]))
            console.log(userinfo[prop])
          }
        }
      }
      console.log(JSON.stringify(userinfo) )
      return JSON.stringify(userinfo) 
    }
    expressCost = 0
    totalCost = 0

  function succeedGetOrder(data){
    if (data['state'] == 1 && data['msg'] == "成功") {
      var 
        order = data['order']
        goods = order['goods']
        expressCost = order['express']
      $('.order-serial-num').text("订单编号: " + order['order_no'])
      $('.order-time').text("下单时间" + order['date'])

      var 
        orderState = "代付款"
        s = order['state']
      if (s == 2) {
        orderState = "代发货"
      } else if (s == 3) {
        orderState = "代收货"
      } else if (s == 4) {
        orderState = "交易结束"
      }
      $('.pay-state').text(orderState)

      for(var i = 0, l = goods.length; i < l; i++) {
        var
          currentGoodsCost = parseFloat(goods[i]['price'])*parseFloat(goods[i]['quantity'])
        totalCost += currentGoodsCost
        insertDOM(goods[i])
      }

      $('.total-cost').text("总额:￥"+totalCost)
      $('.express-cost').text("运费:￥" + expressCost)
    } else if (data['state'] == 0) {
    }
    
    function insertDOM(good) {
      var 
        $item = $("<li data-id='"+good['id']+"'>"
                    +"<a>"
                      +"<img class='po-wine-pic' src='"+good['pics'][0]['pic']+"'>"
                      +"<div class='po-pic-wrap'>"
                        +"<div class='po-title'>"+good['title']+"</div>"
                        +"<span>&yen;</span><span class='price'>"+good['price']+"</span>"
                        +"<span class='po-quantity'>x </span><span class='po-quantity'>"+good['quantity']+"</span>"
                      +"</div>"
                    +"</a>"
                  +"</li>")
        $('.order-listview>ul').append($item)
    }
  }

  var $pay = $("input:radio[name=pay]")
  if ($pay.is(':checked') === false) {
    $pay.filter('[data-m=wx_pub]').prop('checked',true)
  }

  function failedGetOrder(data) {

  }

  $('.pay-radio').click(function(event) {
    $(':radio:checked').prop('checked', 'false')
    $(this).prop('checked', 'true')
  });

  function collectUserInputInfo(){
    var
      payWay = $(":radio:checked").attr('data-m')
      res = {}
      res['channel'] = payWay
      res['order_no'] = orderId
      res['mp'] = $('.tel>span').text()
      res['name'] = $('.name>span').text()
      res['addr_p'] = "上海市"
      res['addr_c'] = "上海市"
      res['addr_d'] = "杨浦区"
      res['address'] = "大学路170号602室"
      res['remarks'] = $(".note-input").val()
    return res
  }

  $('#pay').click(function(event) {
    app.methods.appAjax("请求支付",
                        "pay",
                        "POST",
                        userData(collectUserInputInfo()),
                        app.methods.timestamp(),
                        succeedSubmit,
                        failedSubmit)

    function succeedSubmit(data){
      console.log("data['msg'] = " + data['msg'])
      //在这里获取支付凭据 Charge 
      var 
        charge = data['pay']
        //resultUrl = "http://t.snapwine.net:7784/test.html"
        //charge.extra['result_url'] = resultUrl

      if (data['state'] == 1 && data['msg'] == "成功") {
        var 
          scheme = "http://t.snapwine.net:7784/test.html"
          // params = {
          //   charge:charge,
          //   scheme:scheme
          // }
          pingpp.createPayment(charge, function(result, err) {

              alert(result + " " +err['msg'] + " " + err['extra'])
            if (result.result == "success") {
              alert("支付成功")
            } else{
              alert("支付失败")
            }
          });
      } else if (data['state'] == 0 && data['msg'] == "失败") {
        alert(data['msg'])
      } else {
        alert("other")
      }
    }
    function failedSubmit(data) {
      console.log(data.responseText)
    }
  });
  app.methods.appAjax("获取某个订单的详情",
                      "orderInfo",
                      "POST",
                      userData(orderId),
                      app.methods.timestamp(),
                      succeedGetOrder,
                      failedGetOrder)
});