/**
 * Created by sszhu on 15/12/8.
 */
 jQuery(function(){
  //如果是在微信浏览器中打开,那么移除特卖首页顶部banner
  if (app.methods.browser()=="weixin") {
    $(".header").remove()
  }
  var
    userData = function jointUserinfo() {
      var basicUserinfo = app.methods.getBasicUserinfo()
      return JSON.stringify(basicUserinfo)
    }
  app.methods.appAjax("请求特卖首页",
                        "getMall",
                        "POST",
                        userData(),
                        app.methods.timestamp(),
                        callBack)

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
      $parent = $('.home-special-sell-wrap'), //特卖模块包裹层
      prevModuleItemStart = 0,
      prevHpsrHeight = 0
    for (var i = 0, l = module.length; i < l; i++) {
        var
          currentModule = module[i],
          wineArr = currentModule['goods']

        var 
          barStr = "<div class='module-item'>"
                  +"<div class='module-bar'>"
                    +"<a class='module-clicked' href='list.php?id="
                      +currentModule['id']
                      +"'data-moduleId ='"
                      +currentModule['id']+"'>"
                      +"<div>"
                        +"<img src='"+currentModule['pic']+"'>"
                        +"<span class='moduleName'>"
                          +currentModule['tag']
                        +"</span>"
                      +"</div>"
                      +"<div class='checkout'><span>查看全部</span></div>"
                    +"</a>"
                  +"</div>"
                +"</div>",
          $barHtml = $(barStr),
          $moduleItem = "";
          $parent.append($barHtml)
          $('.module-item').each(function(index, el) {
            if (index == i) {
              $moduleItem = $(el)
              return
            }
          })
        var 
          $moduleListWrap = $("<div class='module-list-wrap'></div>")
          $ul = $("<ul></ul>")
          $moduleListWrap.append($ul)

        var 
          screenWidth = app.screenSize(),
          imgWidth = liWidth = parseInt(parseInt((screenWidth - 26) / 2)),
          ratio = 1.0, //图片原始的高宽比:432 / 720 = 0.6
          imgHeight = Math.ceil(imgWidth * ratio),
          liBottomHeight = 70,
          liHeight = imgHeight + liBottomHeight + 15,
          wineNum = wineArr.length,
          maxWineNum = Math.min(6,wineNum),
          UlOffsetY = Math.ceil(maxWineNum / 2) * liHeight - 15;
          
          $ul.css('height', UlOffsetY)
          
        for (var j = 0; j < maxWineNum; j++) {
          ++ totalWine
          app.methods.produceSeperateWineHtml(wineArr[j],
                                              $ul,
                                              j,
                                              i,
                                              module.length,
                                              wineArr.length,
                                              currentModule['id']) 
          
          $moduleItem.append($moduleListWrap)
          
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