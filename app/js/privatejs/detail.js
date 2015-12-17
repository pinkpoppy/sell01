jQuery(document).ready(function($) {
  var queryArg = app.methods.getSearchArgFromUrl()
  app.acquire(app.urls.detail,'GET',"请求酒款详情",{"id":queryArg.id},function(data){

    (function(imgArr) {
      var parent =  $('.unslider-wrap')
      for(var i = 0,len = data.pics.length; i < len; i++) {
        var li = $("<li class='unslider-active'></li>"),
            img = $("<img src='"+imgArr[i]+"'>")
        li.append(img)
        parent.append(li)
      }
    })(data.pics);

    // 轮播图
    $('.unslider').unslider({
      animation: 'fade',
      autoplay: true,
      arrows: false
    });

    (function showWineData() {
      $('.detail-headline-left').text(data['headline'])
      $('.price-right span').text(data['currentPrice'])
      $('.price-right del').text(data['originalPrice'])

      //$('other-attr .sales-cnt').text("销量 " + data[''])
      $('.other-attr .supply').text("库存 " + data['goodsCnt'])
      $('.other-attr .time-or-restrict').text(data['restrictCnt'])

      var isInActity = function() {
        return !$.isEmptyObject(data.ad)
      }
      if (isInActity()) {
        $('.in-activity a').attr('href', data.ad['url'])
        $('.in-activity a').text(data.ad['name'])
      } else {
         $('.in-activity').remove()
      }
    })();
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