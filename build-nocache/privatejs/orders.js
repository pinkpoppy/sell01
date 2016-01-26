$(function($){

  var
    id = 0
    userData = function jointUserinfo(type) {
      var userinfo = app.methods.getBasicUserinfo()
      userinfo['id'] = id
      userinfo['type'] = type
      return JSON.stringify(userinfo) 
    }

  $('#0').click(function(event) {
    var 
      type = parseInt($(this).attr('id'))
    app.methods.appAjax("获取订单数据",
                        "orderList",
                        "POST",
                        userData(type),
                        app.methods.timestamp(),
                        getOrdersSucceed,
                        getOrdersFailed)
  })

  $('.tab-wrap').click(function(event) {
    var 
      type = parseInt($(this).attr('id'))
    app.methods.appAjax("获取订单数据",
                        "orderList",
                        "POST",
                        userData(type),
                        app.methods.timestamp(),
                        getOrdersSucceed,
                        getOrdersFailed)
      
  })

  function getOrdersSucceed(data) {
    if (data['state'] == 1) {
      var 
        orders = data['orders']
      for (var i = 0,l = orders.length; i < l; i++) {
        // console.log(orders[i])
      }
    }
    
  }

  function getOrdersFailed(data) {

  }

});
