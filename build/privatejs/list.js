
jQuery(function($) {
  var 
    arg = app.appState,
    sortId = 0, //默认的 sortID
    moduleId = app.methods.getSearchArgFromUrl()['id'], //从 url 中获取 模块 ID
    cnt = 0,
    liH = 0,
    range = 80,
    totalHeight = 0
  var 
    $listWrap = $('.wine-list-ul')
  var
    userData = function jointUserinfo() {
      var basicUserinfo = app.methods.getBasicUserinfo()
      basicUserinfo['tag'] = moduleId
      basicUserinfo['id'] = sortId
      return JSON.stringify(basicUserinfo)
    }
  app.methods.appAjax("请求指定列表",
                      "getTagGoods",
                      "POST",
                      userData(),
                      app.methods.timestamp(),
                      callBack)
  function callBack(response) {
    if (response.state==1) {
      var wineArr = response.tag.goods
      //TODO change sortid's value
      $('title').text(response.tag.tag)
      var searchArg = app.methods.getSearchArgFromUrl()
      var l = wineArr.length
      for (var i = 0; i < l; i++) {
        ++cnt
        if (i + 1 == wineArr.length) {
          sortId = wineArr[i]['sortId']
        }
        liH = app.methods.produceSeperateWineHtml(wineArr[i],
          $listWrap,
          i,
          l,
          searchArg.id)
      }
      //console.log("cnt = " + cnt + " liH = " + liH + "Math.ceil(cnt / 2) * liH" + Math.ceil(cnt / 2) * liH)
      var
        ulHeight = Math.ceil(parseFloat($('#wine-list-ul').css('height'))),
        ulHeight += Math.ceil(cnt / 2) * liH
      $('#wine-list-ul').css('height',ulHeight)
    } else if (response.state==0) {
      alert("服务器出错")
    }
  }
  $(document).scroll(function(event) {
    alert("scroll")
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
