
var app = (function(){
  var configUrlMap = {
    //http://t.snapwine.net:7784/pjms/swmp/
    // homeBannerAndNotify:'http://www.yaerku.com/pjms/tmBanner.php',
    // homeModule:'http://www.yaerku.com/pjms/tmHome.php'
    homeBannerAndNotify:'http://t.snapwine.net:7784/pjms/swmp/tmBanner.php',
    homeModule:'http://t.snapwine.net:7784/pjms/swmp/tmHome.php',
    list:'http://t.snapwine.net:7784/pjms/swmp/tmTag.php?id=1&page=2',
    detail:'http://t.snapwine.net:7784/pjms/swmp/tmGoods.php?id=9'
    
  }

  var moduleId = 1,//起始酒款模块 id, 默认值1
      pageId = 1; //酒款分页 id,默认为1

  var appState = {
    module:moduleId,
    page:pageId
  }
  var loadDefaultData = ajaxMethod

  function calScreenWidth(){
    return screen.width
  }

  function getSearchArgFromUrl(){
    var searchString = window.location.search
    var res = {}
    if (searchString.length > 0) {
      var argArr = searchString.substr(1,searchString.length -1 ).split('&')
      
      for (var i = 0; i < argArr.length; i++) {
        var coupleArg = argArr[i].split('=')
        console.log(coupleArg)

        res[coupleArg[0]] = coupleArg[1]
      }
    }
    return res
  }

  function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,function(match,p1) {
      return String.fromCharCode('0x' + p1)
    })
  }

  function aesCBC(pt) {
    var timestamp = Date.now()

  }
  function ajaxMethod(path,methodType,des,data,ajaxCallback) {
    $.ajax({
      url: path,
      method:methodType,
      dataType: 'json',
      data:data
    })
    .done(function(data) {
      console.log("request ajax path : " + path + "des: " + des + "result: successed" );
      ajaxCallback(data);
    })
    .fail(function() {
      console.log("request ajax path : " + path + "des: " + des + "result: failed");
    })
    .always(function() {
      //console.log("request ajax path : " + path + "des: " + des + "result: completed");
    });
  }

  return {
    urls:configUrlMap,
    acquire:loadDefaultData,
    screenSize:calScreenWidth,
    appState:appState,
    methods:{
      produceSeperateWineHtml : produceSeperateWineHtml,
      getSearchArgFromUrl :     getSearchArgFromUrl,
      aesCBC                  : aesCBC
    }
  }

  function produceSeperateWineHtml(currentWine,wrap,wineIndex,moduleIndex,moduleLength,wineLength,moduleId) 
  {
    console.log("arguments.length = " + arguments.length)
    if (arguments.length==5) {
      currentWine = arguments[0],
      wrap = arguments[1],
      wineIndex = arguments[2],
      wineLength = arguments[3],
      moduleId = arguments[4];
    }
    var screenWidth = app.screenSize(),
        imgWidth = liWidth = screenWidth * 0.425,
        ratio = 0.6,
        imgHeight = imgWidth / 0.75,
        bottomHeight = 50,
        liHeight = imgHeight + bottomHeight;

    $li = $("<li></li>")
    $wineWrap = $("<div class='wine-wrap'></div>") //包住酒款
    $divUp = $("<div class='div-up'></div>") //酒款上部
    $divBottom = $("<div class='div-bottom'></div>") //酒款下部



    $awinePic = $("<a class='wine-detail' href='detail.html?moduleId="+moduleId+"&id="+currentWine['id']+"'></a>")
    $spanMailInfo = $("<span class='mail-info'>"+currentWine['mailInfo']+"</span>") //满200包邮 => 酒款上部
    $spanCntInfo = $("<span class='cnt-info'>"+currentWine['goodsCnt']+"</span>") //仅剩6 => 酒款上部
    $img = $("<img class='wine-img' src='"+currentWine['img']+"'>") //酒款图片 => 酒款上部
    $img.css({
      width: imgWidth,
      height:imgHeight
    })

    $spanSubtitle = $("<span class='subtitle'>"+currentWine['subtitle']+"</span>") //副标题 => 酒款上部

    $divHeadline = $("<div>"+currentWine['headline']+"</div>") //主描述 => 酒款下部
    $spanCurrentPrice = $("<span>"+currentWine['currentPrice']+"</span>")//现价 => 酒款下部
    $spanOriginalPrice = $("<del>"+currentWine['originalPrice']+"</del>")//原价 or 其他标注 => 酒款下部
    $spanRecom = $("<span>"+currentWine['restrictCnt']+"</span>")//主描述 => 提示

    $awinePic.append($img)
    $divUp.append($awinePic)
    $divUp.append($spanMailInfo)
    $divUp.append($spanCntInfo)
    $divUp.append($spanSubtitle)


    $divBottom.append($divHeadline)
    $divBottom.append($spanCurrentPrice)
    $divBottom.append($spanOriginalPrice)
    $divBottom.append($spanRecom)

    // 设置 divUp 以及 divBottom 的高度
    $divUp.css('height', imgHeight)
    $divBottom.css('height', bottomHeight)
    $awinePic.css('height', imgHeight)

    $wineWrap.append($divUp)
    $wineWrap.append($divBottom)
    $li.append($wineWrap)

    var y = parseInt(wineIndex / 2) * liHeight
    if (wineIndex % 2 == 0) {
      $li.css({
        left: '5%',
        top:y 
      });
    } else if (wineIndex % 2 == 1) {
      $li.css({
        left: '52.5%',
        top: y
      })
    }

    $wineWrap.css('width', liWidth)

    $(wrap).append($li)
    if (arguments.length == 7){
      console.log("arguments.length: " + arguments.length)
      // if i === 最后一行 && j === 最后一行 添加 margin
      if (moduleIndex == moduleLength - 1 && 
          ((wineIndex == wineLength - 1) || (wineIndex == wineLength - 2))) {
          $li.addClass('last-wine-item')
        }
    } else if (arguments.length == 6) {
      console.log("arguments.length: "+arguments.length)
      if (wineIndex == wineLength-1 || wineIndex == wineLength - 2) {
        $li.addClass('last-wine-item')
      }
    }
  }
  // 432 / 720 = 0.6
  //下面是最后的});
})();