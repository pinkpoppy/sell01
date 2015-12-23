jQuery(document).ready(function($) {
  var 
    userData = function jointUserinfo() {
      var userinfo = app.methods.getBasicUserinfo() 
      return JSON.stringify(userinfo) 
    }
  app.methods.appAjax("获取用户购物车列表",
                      "cart",
                      "POST",
                      userData(),
                      app.methods.timestamp(),
                      getCartSucceed,
                      getCartFailed)

  function getCartSucceed(response){
    //TODO if 购物车没有商品,展示那个空白页面
    
  }

  function getCartFailed(response){
    
  }
});