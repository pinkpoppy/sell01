jQuery(document).ready(function($) {
  //var arg = app.appState

  var $listWrap = $('.wine-list-ul')
  function callBack(wineArr) {
  	var searchArg = app.methods.getSearchArgFromUrl()
    for (var i = 0; i < wineArr.length; i++) {
      console.log(wineArr.length)
      app.methods.produceSeperateWineHtml(wineArr[i],$listWrap,i,wineArr.length,searchArg.id)
    }
  }
  app.acquire(app.urls.list,'GET','获取指定 moduleID 的列表',arg,callBack)
});