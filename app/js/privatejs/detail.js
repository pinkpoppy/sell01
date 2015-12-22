jQuery(document).ready(function($) {
  
  var 
    userData = function jointUserinfo() {
      var basicUserinfo = app.methods.getBasicUserinfo()
      var queryArg = app.methods.getSearchArgFromUrl()
      basicUserinfo['gid'] = queryArg['id']
      return JSON.stringify(basicUserinfo)
    },
    des = '请求酒款详情'
    methodName = 'getGoods',
    requestType = 'POST',
    timestamp = app.methods.timestamp()
    ;

  app.methods.appAjax(des,
                      methodName,
                      requestType,
                      userData(),
                      timestamp,
                      function(data){
    (function(imgArr) {
      var parent =  $('.unslider-wrap')

      for(var i = 0,len = imgArr.length; i < len; i++) {
        var li = $("<li class='unslider-active'></li>"),
            img = $("<img src='"+imgArr[i]['pic']+"'>")
        li.append(img)
        parent.append(li)
      }
    })(data.goods.pics);

    // 轮播图
    $('.unslider').unslider({
      animation: 'fade',
      autoplay: true,
      arrows: false
    });

    (function showWineData(data) {
      $('.detail-headline-left').text(data['title'])
      $('.price-right span').text(data['market'])
      $('.price-right del').text(data['price'])

      $('.other-attr .sales-cnt').text("销量 " + data['sold'])
      $('.other-attr .supply').text("库存 " + data['inventory'])
      $('.other-attr .time-or-restrict').text(data['limit'])

      var isInActity = function() {
        return !$.isEmptyObject(data.ad)
      }
      if (isInActity()) {
        $('.in-activity a').attr('href', data.ad['url'])
        $('.in-activity a').text(data.ad['name'])
      } else {
         $('.in-activity').remove()
      }
    })(data.goods);

    // 商品介绍 开始
    (function showWineIntro (introArr){
      $wrap = $('.detail-wine-intro') //DOM中的包裹元素

      for (var i = 0, l = introArr.length; i < l; i++) {
        var
          wrap = $("<div class='intro-wrap'></div>"),
          img = $("<img class='intro-pic' src='"+introArr[i]['image']+"'>"),
          txt = $("<div class='intro-cont'>"+introArr[i]['text']+"</div>")
        wrap.append(img)
        wrap.append(txt)
        $wrap.append(wrap)
      }
    })(data.goods.intro);
    // 商品介绍 结束
  });
  
  // minus shopping cart
  $('#minus').click(function(event) {
    //app.acquire("")
  });

  // plus shopping cart
  $('#plus').click(function(event) {
    
  });

  // add to shopping cart
  $('#minus').click(function(event) {
    
  });

  // immediate-buy 
  $('#immediate-buy').click(function(event) {
    
  });
});