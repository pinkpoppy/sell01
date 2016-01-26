
jQuery(function($) {
  var 
    arg = app.appState,
    sortId = 0, //默认的 sortID
    moduleId = app.methods.getSearchArgFromUrl()['id'] //从 url 中获取 模块 ID
    cnt = 0
    liH = 0
  var 
    $listWrap = $('.wine-list-ul')

  function callBack(response) {
    if (response.state==1) {
      var wineArr = response.tag.goods
      //TODO change sortid's value
      $('title').text(response.tag.tag)
      var searchArg = app.methods.getSearchArgFromUrl()
      for (var i = 0; i < wineArr.length; i++) {
        ++cnt
        if (i + 1 == wineArr.length) {
          sortId = wineArr[i]['sortId']
        }
        liH = app.methods.produceSeperateWineHtml(wineArr[i],
          $listWrap,
          i,
          wineArr.length,
          searchArg.id)
      }
      console.log(liH + " "+Math.ceil(cnt / 2) * liH)
      var
        ulHeight = Math.ceil(parseFloat($('#wine-list-ul').css('height')))
        ulHeight += Math.ceil(cnt / 2) * liH
        h = ulHeight

      $('#wine-list-ul').css('height',ulHeight)
      $('#scroller').css('height', h)
    } else if (response.state==0) {
      alert("服务器出错")
    }
  }

  var
    userData = function jointUserinfo() {
      var basicUserinfo = app.methods.getBasicUserinfo()
      basicUserinfo['tag'] = moduleId
      basicUserinfo['id'] = sortId
      return JSON.stringify(basicUserinfo)
    },

    des = '请求指定列表'
    methodName = 'getTagGoods'
    requestType = 'POST'
    timestamp = app.methods.timestamp()

  app.methods.appAjax(des,methodName,requestType,userData(),timestamp,callBack)

  var
    range = 80
    totalHeight = 0
    

    $(window).scroll(function(event) {
      windowHeight = parseFloat($(window).height())
      var scrollTop = parseFloat($(document).scrollTop())
      console.log("scroll")
      totalHeight = windowHeight + scrollTop
      console.log("scrollTop = " + scrollTop + " " + "totalHeight = " + totalHeight + "documentHeight = " + $(document).height())
      if (totalHeight >= $(document).height() - range) {
        app.methods.appAjax(des,methodName,requestType,userData(),timestamp,callBack)
      }
    });
});
