!function($){return $?($.Unslider=function(t,n){var e=this;return e._="unslider",e.defaults={autoplay:!1,delay:3e3,speed:750,easing:"swing",keys:{prev:37,next:39},nav:!0,arrows:{prev:'<a class="'+e._+'-arrow prev">←</a>',next:'<a class="'+e._+'-arrow next">→</a>'},animation:"horizontal",selectors:{container:"ul:first",slides:"li"},animateHeight:!1,activeClass:e._+"-active",swipe:!0},e.$context=t,e.options={},e.$parent=null,e.$container=null,e.$slides=null,e.$nav=null,e.$arrows=[],e.total=0,e.current=0,e.prefix=e._+"-",e.eventSuffix="."+e.prefix+~~(2e3*Math.random()),e.interval=null,e.init=function(t){return e.options=$.extend({},e.defaults,t),e.$container=e.$context.find(e.options.selectors.container).addClass(e.prefix+"wrap"),e.$slides=e.$container.children(e.options.selectors.slides),e.setup(),["nav","arrows","keys","infinite"].forEach(function(t){e.options[t]&&e["init"+$._ucfirst(t)]()}),void 0!==typeof jQuery.event.special.swipe&&e.options.swipe&&e.initSwipe(),e.options.autoplay&&e.start(),e.calculateSlides(),e.$context.trigger(e._+".ready"),e.animate(e.options.index||e.current,"init")},e.setup=function(){e.$context.addClass(e.prefix+e.options.animation).wrap('<div class="'+e._+'" />'),e.$parent=e.$context.parent("."+e._);var t=e.$context.css("position");"static"===t&&e.$context.css("position","relative"),e.$context.css("overflow","visible")},e.calculateSlides=function(){if(e.total=e.$slides.length,"fade"!==e.options.animation){var t="width";"vertical"===e.options.animation&&(t="height"),e.$container.css(t,100*e.total+"%").addClass(e.prefix+"carousel"),e.$slides.css(t,100/e.total+"%")}},e.start=function(){return e.interval=setTimeout(function(){e.next()},e.options.delay),e},e.stop=function(){return clearTimeout(e.interval),e},e.initNav=function(){var t=$('<nav class="'+e.prefix+'nav"><ol /></nav>');e.$slides.each(function(n){var i=this.getAttribute("data-nav")||n+1;$.isFunction(e.options.nav)&&(i=e.options.nav.call(e.$slides.eq(n),n,i)),t.children("ol").append('<li data-slide="'+n+'">'+i+"</li>")}),e.$nav=t.insertAfter(e.$context),e.$nav.find("li").on("click"+e.eventSuffix,function(){var t=$(this).addClass(e.options.activeClass);t.siblings().removeClass(e.options.activeClass),e.animate(t.attr("data-slide"))})},e.initArrows=function(){e.options.arrows===!0&&(e.options.arrows=e.defaults.arrows),$.each(e.options.arrows,function(t,n){e.$arrows.push($(n).insertAfter(e.$context).on("click"+e.eventSuffix,e[t]))})},e.initKeys=function(){e.options.keys===!0&&(e.options.keys=e.defaults.keys),$(document).on("keyup"+e.eventSuffix,function(t){$.each(e.options.keys,function(n,i){t.which===i&&$.isFunction(e[n])&&e[n].call(e)})})},e.initSwipe=function(){var t=e.$slides.width();e.$container.on({swipeleft:e.next,swiperight:e.prev,movestart:function(t){return t.distX>t.distY&&t.distX<-t.distY||t.distX<t.distY&&t.distX>-t.distY?!!t.preventDefault():void e.$container.css("position","relative")}}),"fade"!==e.options.animation&&e.$container.on({move:function(n){e.$container.css("left",-(100*e.current)+100*n.distX/t+"%")},moveend:function(n){return Math.abs(n.distX)/t<$.event.special.swipe.settings.threshold?e._move(e.$container,{left:-(100*e.current)+"%"},!1,200):void 0}})},e.initInfinite=function(){var t=["first","last"];t.forEach(function(n,i){e.$slides.push.apply(e.$slides,e.$slides.filter(':not(".'+e._+'-clone")')[n]().clone().addClass(e._+"-clone")["insert"+(0===i?"After":"Before")](e.$slides[t[~~!i]]()))})},e.destroyArrows=function(){e.$arrows.forEach(function(t){t.remove()})},e.destroySwipe=function(){e.$container.off("movestart move moveend")},e.destroyKeys=function(){$(document).off("keyup"+e.eventSuffix)},e.setIndex=function(t){return 0>t&&(t=e.total-1),e.current=Math.min(Math.max(0,t),e.total-1),e.options.nav&&e.$nav.find('[data-slide="'+e.current+'"]')._toggleActive(e.options.activeClass),e.$slides.eq(e.current)._toggleActive(e.options.activeClass),e},e.animate=function(t,n){if("first"===t&&(t=0),"last"===t&&(t=e.total),isNaN(t))return e;e.options.autoplay&&e.stop().start(),e.setIndex(t),e.$context.trigger(e._+".change",[t,e.$slides.eq(t)]);var i="animate"+$._ucfirst(e.options.animation);return $.isFunction(e[i])&&e[i](e.current,n),e},e.next=function(){var t=e.current+1;return t>=e.total&&(t=0),e.animate(t,"next")},e.prev=function(){return e.animate(e.current-1,"prev")},e.animateHorizontal=function(t){var n="left";return"rtl"===e.$context.attr("dir")&&(n="right"),e.options.infinite&&e.$container.css("margin-"+n,"-100%"),e.slide(n,t)},e.animateVertical=function(t){return e.options.animateHeight=!0,e.options.infinite&&e.$container.css("margin-top",-e.$slides.outerHeight()),e.slide("top",t)},e.slide=function(t,n){if(e.options.animateHeight&&e._move(e.$context,{height:e.$slides.eq(n).outerHeight()},!1),e.options.infinite){var i;n===e.total-1&&(i=e.total-3,n=-1),n===e.total-2&&(i=0,n=e.total-2),"number"==typeof i&&(e.setIndex(i),e.$context.on(e._+".moved",function(){e.current===i&&e.$container.css(t,-(100*i)+"%").off(e._+".moved")}))}var o={};return o[t]=-(100*n)+"%",e._move(e.$container,o)},e.animateFade=function(t){var n=e.$slides.eq(t).addClass(e.options.activeClass);e._move(n.siblings().removeClass(e.options.activeClass),{opacity:0}),e._move(n,{opacity:1},!1)},e._move=function(t,n,i,o){return i!==!1&&(i=function(){e.$context.trigger(e._+".moved")}),t._move(n,o||e.options.speed,e.options.easing,i)},e.init(n)},$.fn._toggleActive=function(t){return this.addClass(t).siblings().removeClass(t)},$._ucfirst=function(t){return(t+"").toLowerCase().replace(/^./,function(t){return t.toUpperCase()})},$.fn._move=function(){var t="animate";return this.stop(!0,!0),$.fn.velocity&&(t="velocity"),$.fn[t].apply(this,arguments)},void($.fn.unslider=function(t){return this.each(function(){var n=$(this);if("string"==typeof t&&n.data("unslider")){t=t.split(":");var e=t[0],i=n.data("unslider")[e];if(t[1]){var o=t[1].split(",");return $.isFunction(i)&&i.apply(n,o)}return $.isFunction(i)&&i(),this}return n.data("unslider",new $.Unslider(n,t))})})):console.warn("Unslider needs jQuery")}(window.jQuery);

var app = (function(){
  var configUrlMap = {
    // homeBannerAndNotify:'http://www.yaerku.com/pjms/tmBanner.php',
    // homeModule:'http://www.yaerku.com/pjms/tmHome.php'
    homeBannerAndNotify:'http://192.168.1.4:7784/tmBanner.php',
    homeModule:'http://192.168.1.4:7784/tmHome.php'
    list:'http://192.168.1.4:7784/tmTag.php?id=1&page=2'
  }

  function calScreenWidth(){
    return screen.width
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
    get:loadDefaultData,
    screenSize:calScreenWidth
  }

  // 432 / 720 = 0.6
})();

/**
 * Created by sszhu on 15/12/8.
 */
jQuery(document).ready(function($){
  $('.unslider').unslider({
    animation: 'fade',
    autoplay: true,
    arrows: false
  });

  app.get(app.urls.homeBannerAndNotify,"请求特卖首页轮播图片和通知",function(data){
    var imgArr = data.img,
        notification = data.notification;
    var parent = $('.unslider>ul');
    var notify = $('.notify');

    for(var i = 0; i < imgArr.length; i++) {
      var li = $("<li class='unslider-active' data-url="+imgArr[i]['url']+"></li>");
      var img = $("<img src='"+imgArr[i]['pic']+"'>");
      li.append(img);
      parent.append(li);
    }
    notify.text(notification);
  });

  app.get(app.urls.homeModule,"请求特卖首页特卖模块",function(data){
    var totalWine = 0,
        screenWidth = app.screenSize(),
        imgWidth = liWidth = screenWidth * 0.425,
        ratio = 0.6,
        imgHeight = imgWidth / 0.75,
        bottomHeight = 50,
        liHeight = imgHeight + bottomHeight;
        console.log("screenWidth: " + screenWidth + " imgWidth: " + imgWidth)

    var moduleArr = data.specialSellModule,
        parent = $('.home-special-sell-wrap') //特卖模块包裹层
        for (var i = 0; i < moduleArr.length; i++) {

          var currentModule = moduleArr[i],
              wineArr = currentModule['exampleList'];

          var $moduleItem = $("<div class='module-item'></div>"),
              $moduleBar = $("<div class='module-bar'></div>"),
              $a = $("<a data-moduleId ='"+currentModule['id']+"'></a>"),
              $img = $("<img src='"+currentModule['modulImgLink']+"'>"),
              $moduleName = $("<span>"+currentModule['moduleName']+"</span>"),
              $checkOut = $("<span>查看全部 >></span>");

          $a.append($img)
          $a.append($moduleName)
          $a.append($checkOut)
          $moduleBar.append($a)
          
          
          var $moduleListWrap = $("<div class='module-list-wrap'></div>")

          $ul = $("<ul></ul>")

          for (var j = 0; j < wineArr.length; j++) {
            var currentWine = wineArr[j];
                ++ totalWine

                $li = $("<li></li>")

                $wineWrap = $("<div class='wine-wrap'></div>") //包住酒款
                $wineWrap.css('width', liWidth);

                $divUp = $("<div class='div-up'></div>") //酒款上部
                $divBottom = $("<div class='div-bottom'></div>") //酒款下部

                $awinePic = $("<a class='wine-detail'></a>")
                $spanMailInfo = $("<span class='mail-info'>"+currentWine['mailInfo']+"</span>") //满200包邮 => 酒款上部
                $spanCntInfo = $("<span class='cnt-info'>"+currentWine['goodsCnt']+"</span>") //仅剩6 => 酒款上部
                $img = $("<img class='wine-img' src='"+currentWine['img']+"'>") //酒款图片 => 酒款上部

                $img.css({
                  width: imgWidth,
                  height:imgHeight
                });

                $spanSubtitle = $("<span class='subtitle'>"+currentWine['subtitle']+"</span>") //副标题 => 酒款上部

                $divHeadline = $("<div>"+currentWine['headline']+"</div>") //主描述 => 酒款下部
                $spanCurrentPrice = $("<span>"+currentWine['currentPrice']+"</span>")//现价 => 酒款下部
                $spanOriginalPrice = $("<del>"+currentWine['originalPrice']+"</del>")//原价 or 其他标注 => 酒款下部
                $spanRecom = $("<span>"+currentWine['restrictCnt']+"</span>")//主描述 => 提示

                $awinePic.append($img)
                $divUp.append($awinePic)
                $divUp.append($spanMailInfo)
                $divUp.append($spanCntInfo)
                $divUp.append($spanSubtitle)
            

                $divBottom.append($divHeadline)
                $divBottom.append($spanCurrentPrice)
                $divBottom.append($spanOriginalPrice)
                $divBottom.append($spanRecom)

                // 设置 divUp 以及 divBottom 的高度
                $divUp.css('height', imgHeight)
                $divBottom.css('height', bottomHeight)
                $awinePic.css('height', imgHeight)

                $wineWrap.append($divUp)
                $wineWrap.append($divBottom)
                $li.append($wineWrap)

                $ul.append($li)

             
               var y = parseInt(j / 2) * liHeight
                if (j % 2 ==0) {
                  
                  $li.css({
                    left: '5%',
                    top:y 
                  });
                } else if (j % 2 == 1) {
                  $li.css({
                    left: '52.5%',
                    top: y
                  });
                }
                $wineWrap.css('wid', liWidth);

                // if i === 最后一行 && j === 最后一行 添加 margin
                if (i == moduleArr.length - 1 && 
                    (j == wineArr.length - 1) || 
                    (j == wineArr.length - 2)) {
                  $li.addClass('last-wine-item')
                }
          }
          $moduleListWrap.append($ul)

          var itemTop = 0
          if (i > 0) {
            var itemTop = i * 30 + Math.ceil(totalWine / 2 ) * liHeight
            console.log("itemTop: " + itemTop + " i: " + i)
          }
          
          $moduleItem.css({
            top: itemTop,
            left: 0
          });
          $moduleItem.append($moduleBar)
          $moduleItem.append($moduleListWrap)
          parent.append($moduleItem)
        }
  });  
});
