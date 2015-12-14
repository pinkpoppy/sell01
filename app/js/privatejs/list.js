jQuery(document).ready(function($) {
  var arg = app.appState

  function callBack(wineArr) {
    for (var i = 0; i < wineArr.length; i++) {
      console.log(wineArr.length)
      app.methods.produceSeperateWineHtml(app,wineArr[i],$('.wine-list-ul'),i,wineArr.length)
    }
  }
  app.acquire(app.urls.list,'GET','获取指定 moduleID 的列表',arg,callBack)
});