/**
 * Created by sszhu on 15/12/8.
 */
 jQuery(document).ready(function($){
  //如果是在微信浏览器中打开,那么移除特卖首页顶部banner
  if (app.methods.browser()=="weixin") {
    $(".header").remove()
  }

  // $('.banner').unslider()

  var
    userData = function jointUserinfo() {
      var basicUserinfo = app.methods.getBasicUserinfo()
      return JSON.stringify(basicUserinfo)
    },

    des = '请求特卖首页'
    methodName = 'getMall',
    requestType = 'POST',
    timestamp = app.methods.timestamp()

  app.methods.appAjax(des,methodName,requestType,userData(),timestamp,callBack)

  function callBack(response) {
    if (response.msg=="成功") {
      var 
        imgArr = response.banner.items,//获取轮播图
        notification = response.notice,//获取通知
        moduleArr = response.tags//获取模块

      var 
        wrap = $("<div class='banner' id='home-banner'></div>") 
        ul = $("<ul></ul>")
        wrap.append(ul)
        notify = $('.notify')

      // 轮播图和通知 开始
      for(var i = 0, len = imgArr.length; i < len; i++) {
        var 
          // li = $("<li class='unslider-active' data-url="+imgArr[i]['url']+"></li>"),
          li = $("<li data-url="+imgArr[i]['url']+"></li>"),
          img = $("<img src='"+imgArr[i]['pic']+"'>")
          li.append(img)
          ul.append(li)
      }
      $(wrap).insertBefore('.notify')

      $('.banner').unslider({autoplay:true})
      notify.text(notification)
      // 轮播图和通知 结束

      // 特卖主体 开始
      insertDOM(response.tags)
      // 特卖主体 结束
    }
  }

  function insertDOM(module) {
    var
      totalWine = 0,
      parent = $('.home-special-sell-wrap') //特卖模块包裹层
      for (var i = 0, l = module.length; i < l; i++) {
        var
          currentModule = module[i],
          wineArr = currentModule['goods']

        var 
          $moduleItem = $("<div class='module-item'></div>"),
          $moduleBar = $("<div class='module-bar'></div>"),
          $a = $("<a class='module-clicked' href='list.html?id="+currentModule['id']+"'data-moduleId ='"+currentModule['id']+"'></a>"),
          $img = $("<img src='"+currentModule['pic']+"'>"),
          $moduleName = $("<span>"+currentModule['tag']+"</span>"),
          $checkOut = $("<span>查看全部 >></span>")

          $a.append($img)
          $a.append($moduleName)
          $a.append($checkOut)
          $moduleBar.append($a)
          $moduleItem.append($moduleBar)

        var 
          $moduleListWrap = $("<div class='module-list-wrap'></div>"),
          $ul = $("<ul></ul>")

        var 
          screenWidth = app.screenSize(),
          imgWidth = liWidth = screenWidth * 0.425,
          ratio = 0.6,
          imgHeight = imgWidth / 0.75,
          bottomHeight = 50,
          liHeight = imgHeight + bottomHeight

        for (var j = 0; j < wineArr.length; j++) {
          ++ totalWine
          app.methods.produceSeperateWineHtml(wineArr[j],
                                              $ul,
                                              j,
                                              i,
                                              module.length,
                                              wineArr.length,
                                              currentModule['id'])
          $moduleListWrap.append($ul)
          var itemTop = 0
          if (i > 0) {
            var itemTop = i * 30 + Math.ceil(totalWine / 2 ) * liHeight
          }
          $moduleItem.css({
            top: itemTop,
            left: 0
          });
          
          $moduleItem.append($moduleListWrap)
          parent.append($moduleItem)
      }
      $(".wine-detail").click(function(event) {
        event.stopPropagation()
      });
    }
  }
});