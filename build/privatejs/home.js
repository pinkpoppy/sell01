/**
 * Created by sszhu on 15/12/8.
 */
 jQuery(function(){
  //如果是在微信浏览器中打开,那么移除特卖首页顶部banner
  if (app.methods.browser()=="weixin") {
    $(".header").remove()
  }
  var userData = function jointUserinfo() {
      var basicUserinfo = app.methods.getBasicUserinfo()
      return JSON.stringify(basicUserinfo)
    }
   app.methods.appAjax("获取用户购物车列表",
       "getCartCount",
       "POST",
       userData(),
       app.methods.timestamp(),
       function(data){
         if (data['state'] == 1) {
           var gooodsInCart = 0
           gooodsInCart = data['count']
           $('#goods-num').text(gooodsInCart)
         } else {
           //alert("服务器繁忙,请刷新页面再试")
         }
       })
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
        wrap = $("<div class='banner' id='home-banner'></div>"), 
        ul = $("<ul></ul>"),
        notify = $('.notify')
        wrap.append(ul)
      for(var i = 0, len = imgArr.length; i < len; i++) {
        var 
          li = $("<li data-url="+imgArr[i]['url']+" class='slider-li'></li>"),
          img = $("<img src='"+imgArr[i]['pic']+"'>")
          li.append(img)
          ul.append(li)
      }
      $(wrap).insertBefore('.notify')
      $('.slider-li').on('click',function(){
        var url = $(this).data('url')
        location.assign(url)
      })
      $('.banner').unslider({autoplay:true,arrows:false})
      if (notification=='' || notification==undefined) {
        notify.remove()
        console.log("notify remove")
      } else {
        notify.text(notification)
        console.log("notify have content")
      }
      insertDOM(response.tags)
    }
  }

  function insertDOM(module) {
    var $parent = $('.home-special-sell-wrap')
    var moduleItemTop = 15
    var moduleLen = module.length

    for (var i = 0;i < moduleLen; i++) {
        var currentModule = module[i]
        var wineArr = currentModule['goods']
        var barStr = "<div class='module-item'>"
                  +"<div class='module-bar'>"
                    +"<a class='module-clicked' href='list.php?id="
                      +currentModule['id']
                      +"'data-moduleId ='"
                      +currentModule['id']+"'>"
                      +"<div>"
                        +"<img src='"+currentModule['pic']+"'>"
                        +"<div class='mo-ba-fl-wr'>"
                          +"<span class='moduleName'>"
                            +currentModule['tag']
                          +"</span>"
                          +"<span>查看全部</span>"
                        +"</div>"
                      +"</div>"
                    +"</a>"
                  +"</div>"
                +"</div>"
          var $barHtml = $(barStr)
          var $moduleItem = ""
          $parent.append($barHtml)
          $('.module-item').each(function(index, el) {
            if (index == i) {
              $moduleItem = $(el)
              return
            }
          })

        var wineNum = wineArr.length
        var maxWineNum = Math.min(6,wineNum)
        app.methods.produceWineList(wineArr,maxWineNum,$moduleItem)
        $moduleItem.css({
          top: moduleItemTop,
          left: 0
        });
        moduleItemTop += parseInt($moduleItem.css('height')) + 15
      $(".wine-detail").click(function(event) {
        event.stopPropagation()
      });
    }
  }

});