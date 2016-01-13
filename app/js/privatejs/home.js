/**
 * Created by sszhu on 15/12/8.
 */
 jQuery(document).ready(function(){
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
    var r = response
    x = r.state
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

      $('.banner').unslider({autoplay:true,arrows:false})
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
      prevModuleItemStart = 0
      prevHpsrHeight = 0
    for (var i = 0, l = module.length; i < l; i++) {
        var
          currentModule = module[i],
          wineArr = currentModule['goods']

        var 
          $moduleItem = $("<div class='module-item'></div>"),
          $moduleBar = $("<div class='module-bar'></div>"),
          $a = $("<a class='module-clicked' href='list.php?id="+currentModule['id']+"'data-moduleId ='"+currentModule['id']+"'></a>"),
          $justifyLeftDiv = $("<div></div>"),
          $justifyRightDiv = $("<div class='checkout'></div>"),
          $img = $("<img src='"+currentModule['pic']+"'>"),
          $moduleName = $("<span class='moduleName'>"+currentModule['tag']+"</span>"),
          $checkOut = $("<span>查看全部</span>")

          $justifyLeftDiv.append($img)
          $justifyLeftDiv.append($moduleName)
          $justifyRightDiv.append($checkOut)

          // $a.append($img)
          // $a.append($moduleName)
          // $a.append($checkOut)
          $a.append($justifyLeftDiv)
          $a.append($justifyRightDiv)
          $moduleBar.append($a)
          $moduleItem.append($moduleBar)

        var 
          $moduleListWrap = $("<div class='module-list-wrap'></div>"),
          $ul = $("<ul></ul>")
          $moduleListWrap.append($ul)

        var 
          screenWidth = app.screenSize()
          imgWidth = liWidth = parseInt(parseInt((screenWidth - 26) / 2))
          ratio = 0.6 //图片原始的高宽比:432 / 720 = 0.6
          imgHeight = Math.ceil(imgWidth * ratio)
          liBottomHeight = 70
          liHeight = imgHeight + liBottomHeight + 15
          wineNum = wineArr.length
          UlOffsetY = Math.ceil(wineNum / 2) * liHeight - 15
          $ul.css('height', UlOffsetY)
        for (var j = 0; j < wineArr.length; j++) {
          ++ totalWine
          app.methods.produceSeperateWineHtml(wineArr[j],
                                              $ul,
                                              j,
                                              i,
                                              module.length,
                                              wineArr.length,
                                              currentModule['id'])    
          $moduleItem.append($moduleListWrap)
          parent.append($moduleItem)
         }
       if (i > 0) {
          prevModuleItemStart += Math.ceil(parseInt($moduleItem.css('height')))
        }
        $moduleItem.css({
          top: prevModuleItemStart,
          left: 0
        });

      $(".wine-detail").click(function(event) {
        event.stopPropagation()
      });
    }
  }
});