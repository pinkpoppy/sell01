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
    var moduleArr = data.specialSellModule,
        parent = $('.home-special-sell-wrap');
        for (var i = 0; i < moduleArr.length; i++) {

          var currentModule = moduleArr[i],
              wineArr = currentModule['exampleList'];

          var $moduleItem = $("<div class='module-item'></div>"),
              $moduleBar = $("<div class='module-bar'></div>"),
              $a = $("<a data-moduleId ='"+currentModule['id']+"'></a>"),
              $img = $("<img src='"+currentModule['modulImgLink']+"'>"),
              $moduleName = $("<span>"+currentModule['moduleName']+"</span>"),
              $checkOut = $("<span>查看全部</span>");

          $a.append($img)
          $a.append($moduleName)
          $a.append($checkOut)
          $moduleBar.append($a)
          $moduleItem.append($moduleBar)

          parent.append($moduleItem)
          var $moduleListWrap = $("<div class='module-list-wrap'></div>")
          parent.append($moduleListWrap)

          for (var j = 0; j < wineArr.length; j++) {
            var currentWine = wineArr[j];
                $ul = $("<ul></ul>")
                $li = $("<li></li>")

                $wineWrap = $("<div></div>") //包住酒款

                $divUp = $("<div></div>") //酒款上部
                $divBottom = $("<div></div>") //酒款下部

                $spanMailInfo = $("<span>"+currentWine['mailInfo']+"</span>") //满200包邮 => 酒款上部
                $spanCntInfo = $("<span>"+currentWine['goodsCnt']+"</span>") //仅剩6 => 酒款上部
                $img = $("<img src='"+currentWine['img']+"'>") //酒款图片 => 酒款上部
                $spanSubtitle = $("<span>"+currentWine['subtitle']+"</span>") //副标题 => 酒款上部

                $divHeadline = $("<div>"+currentWine['headline']+"</div>") //主描述 => 酒款下部
                $spanCurrentPrice = $("<span>"+currentWine['currentPrice']+"</span>")//现价 => 酒款下部
                $spanOriginalPrice = $("<del>"+currentWine['originalPrice']+"</del>")//原价 or 其他标注 => 酒款下部
                $spanRecom = $("<span>"+currentWine['restrictCnt']+"</span>")//主描述 => 提示

                $divUp.append($img)
                $divUp.append($spanMailInfo)
                $divUp.append($spanCntInfo)
                $divUp.append($spanSubtitle)

                $divBottom.append($divHeadline)
                $divBottom.append($spanCurrentPrice)
                $divBottom.append($spanOriginalPrice)
                $divBottom.append($spanRecom)

                $wineWrap.append($divUp)
                $wineWrap.append($divBottom)
                $li.append($wineWrap)

                $ul.append($li)
                $moduleListWrap.append($ul)
          }
          $moduleItem.append($moduleListWrap)
        }


  });  
});