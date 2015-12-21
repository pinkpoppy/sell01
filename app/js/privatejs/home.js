/**
 * Created by sszhu on 15/12/8.
 */
 jQuery(document).ready(function($){
  $('.unslider').unslider({
    animation: 'fade',
    autoplay: true,
    arrows: false
  });

  // app.acquire(app.urls.homeBannerAndNotify,'GET',"请求特卖首页轮播图片和通知",{},function(data){
  //   var imgArr = data.img,
  //   notification = data.notification;
  //   var parent = $('.unslider>ul');
  //   var notify = $('.notify');

  //   for(var i = 0; i < imgArr.length; i++) {
  //     var li = $("<li class='unslider-active' data-url="+imgArr[i]['url']+"></li>");
  //     var img = $("<img src='"+imgArr[i]['pic']+"'>");
  //     li.append(img);
  //     parent.append(li);
  //   }
  //   notify.text(notification);
  // });

  var
    userData = function jointUserinfo() {
      var basicUserinfo = app.methods.getBasicUserinfo()
      return JSON.stringify(basicUserinfo)
    },

    des = '请求特卖首页轮播图片和通知'
    methodName = 'getMall',
    requestType = 'POST',
    timestamp = app.methods.timestamp()
  ;
  app.methods.appAjax(des,
                      methodName,
                      requestType,
                      userData(),
                      timestamp,
                      function(response){
                        if (response.msg=="成功") {
                          var imgArr = response.banner.items,
                          notification = response.notice;
                          
                          var parent = $('.unslider>ul'),
                          notify = $('.notify');

                          console.log(response.banner.items.length)
                          for(var i = 0, len = imgArr.length; i < len; i++) {
                            var li = $("<li class='unslider-active' data-url="+imgArr[i]['url']+"></li>")
                            console.log("i = " + i + 1 + imgArr[i]['pic'])
                            var img = $("<img src='"+imgArr[i]['pic']+"'>")
                            li.append(img)
                            parent.append(li)
                          }
                          notify.text(notification)
                        }
                        
                      })


  // app.acquire(app.urls.homeModule,'GET',"请求特卖首页特卖模块",{},function(data){
  //   var totalWine = 0
  //   var moduleArr = data.specialSellModule
  //   parent = $('.home-special-sell-wrap') //特卖模块包裹层
  //   for (var i = 0; i < moduleArr.length; i++) {
  //     var currentModule = moduleArr[i],
  //         wineArr = currentModule['exampleList'];

  //     var $moduleItem = $("<div class='module-item'></div>"),
  //         $moduleBar = $("<div class='module-bar'></div>"),
  //         $a = $("<a class='module-clicked' href='list.html?page=1&id="+currentModule['id']+"'data-moduleId ='"+currentModule['id']+"'></a>"),
  //         $img = $("<img src='"+currentModule['modulImgLink']+"'>"),
  //         $moduleName = $("<span>"+currentModule['moduleName']+"</span>"),
  //         $checkOut = $("<span>查看全部 >></span>");

  //         $a.append($img)
  //         $a.append($moduleName)
  //         $a.append($checkOut)
  //         $moduleBar.append($a)
  //         $moduleItem.append($moduleBar)
          
  //     var $moduleListWrap = $("<div class='module-list-wrap'></div>")

  //     $ul = $("<ul></ul>")

  //     var screenWidth = app.screenSize(),
  //       imgWidth = liWidth = screenWidth * 0.425,
  //       ratio = 0.6,
  //       imgHeight = imgWidth / 0.75,
  //       bottomHeight = 50,
  //       liHeight = imgHeight + bottomHeight;

        
  //     for (var j = 0; j < wineArr.length; j++) {
  //       ++ totalWine
  //       app.methods.produceSeperateWineHtml(wineArr[j],
  //                                           $ul,
  //                                           j,
  //                                           i,
  //                                           moduleArr.length,
  //                                           wineArr.length,
  //                                           currentModule['id'])
  //       $moduleListWrap.append($ul)
  //       var itemTop = 0
  //       if (i > 0) {
  //         var itemTop = i * 30 + Math.ceil(totalWine / 2 ) * liHeight
  //         //console.log("itemTop: " + itemTop + " i: " + i)
  //       }
  //       $moduleItem.css({
  //         top: itemTop,
  //         left: 0
  //       });
        
  //       $moduleItem.append($moduleListWrap)
  //       parent.append($moduleItem)
  //     }
  //   }
  // });
//下面是最后的});
});