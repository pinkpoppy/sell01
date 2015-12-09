
var app = (function(){
  var configUrlMap = {
    homeBannerAndNotify:'http://www.yaerku.com/pjms/tmBanner.php',
    homeModule:'http://www.yaerku.com/pjms/tmHome.php'
  }
  var loadDefaultData = function(path,des,ajaxCallback,data){
    $.ajax({
      url: path,
      dataType: 'json',
      data:data
    })
    .done(function(data) {
      console.log("request ajax path : " + path + "des: " + des + "result: successed" );
      ajaxCallback(data);
    })
    .fail(function() {
      console.log("request ajax path : " + path + "des: " + des + "result: failed");
    })
    .always(function() {
       //console.log("request ajax path : " + path + "des: " + des + "result: completed");
    });
  }
  return {
    urls:configUrlMap,
    get:loadDefaultData
  };
})();