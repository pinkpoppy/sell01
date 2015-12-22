
jQuery(document).ready(function($) {
  var 
    arg = app.appState,
    sortId = 0, //默认的 sortID
    moduleId = app.methods.getSearchArgFromUrl()['id'] //从 url 中获取 模块 ID

  var 
    $listWrap = $('.wine-list-ul')

  function callBack(response) {
    if (response.state==1) {
      var wineArr = response.tag.goods
      //TODO change sortid's value
      $('title').text(response.tag.tag)
      var searchArg = app.methods.getSearchArgFromUrl()
      for (var i = 0; i < wineArr.length; i++) {
        if (i + 1 == wineArr.length) {
          sortId = wineArr[i]['sortId']
        }
        app.methods.produceSeperateWineHtml(wineArr[i],
          $listWrap,
          i,
          wineArr.length,
          searchArg.id)
      }
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
    methodName = 'getTagGoods',
    requestType = 'POST',
    timestamp = app.methods.timestamp()

  app.methods.appAjax(des,methodName,requestType,userData(),timestamp,callBack)
});