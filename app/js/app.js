
var app = (function(){
  var configUrlMap = {
    APIBase : "http://www.yaerku.com/pjapi/"
    //APIBase:"../app/json/home.json"
  }

  var config = {
    Base64Key:"RkVB2p5ida3ywUDJf7IgXcoGrm8TjOEAb",
    userId :"o4ILEuHaZ9rZqXcEL4izPJcEnFnM",
    userType : "5"
  }

  var moduleId = 1,//起始酒款模块 id, 默认值1
      pageId = 1; //酒款分页 id,默认为1

  var appState = {
      module:moduleId,
      page:pageId
  }
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
  
  function deviceInfo(){
    var device = "iphone"
    return device
  }  

  function appVersion(){
    var version = "2.2.0"
    return version
  }

  function timestamp(){
    return parseInt(new Date() / 1000)
  }

  function ajaxLog(path,des,feedback) {
    console.log("Ajax path : " + path + 
                "des: " + des + 
                "result: " + feedback)
  }
  function AES(plainText,timestamp) {
    pkcs7 = function(str) {
      var len = str.length,
          block_size = 32,
          pad = block_size-(len % block_size),
          padChar=String.fromCharCode(pad);

      for (var i = 0; i < pad; i++) {
        str = str + padChar
      }
      return str
    }

    var Base64Key = config['Base64Key'] + timestamp + '=',
        key = CryptoJS.enc.Base64.parse(Base64Key),
        iv = key.left(16);

    var text=pkcs7(plainText)
        ciphertext = CryptoJS.AES.encrypt(text, 
                                          key, 
                                          {iv: iv, 
                                            mode:CryptoJS.mode.CBC, 
                                            padding:CryptoJS.pad.NoPadding}),
        base64Text = CryptoJS.enc.Base64.stringify(ciphertext.ciphertext)
    return base64Text
  }

  /**
  *@param Des descripption of the request String
  *@param MethodName specific API name of current request String
  *@param RequestType GET/POST or Other Type String
  *@param userData JSON
  *@param Timestamp Current Timestamp an 10bit Interger
  */
  function appAjax(des,
                   methodName,
                   requestType,
                   userData,
                   timestamp,
                   callBack
                   ) {
    var 
      path = configUrlMap['APIBase']
      data = jointPostData(methodName,timestamp,AES(userData,timestamp))
    $.ajax({
      url : path,
      method : requestType,
      dataType : 'json',
      data : data
    })
    .done(function(data) {
      ajaxLog(path,des,'successed')
      //var json = JSON.parse(JSON.stringify(eval( "(" + data +")")))
      //callBack(json)
      callBack(data)
    })
    .fail(function(data) {
      ajaxLog(path,des,'failed')
    })
    .always(function() {
      ajaxLog(path,des,'completed')
    });
  }

  /**
  *   
  */
  function getUserinfoData(){
    var u = {}
    u.userId = config.userId
    u.userType = config.userType
    u.version = appVersion()
    u.deviceMode = deviceInfo()
    return u
  }

  /**
  * @m API method name
  * @t timestamp using for AES
  * @p base64text representing the sensitive user info
  */
  function jointPostData(m,t,p) {
    return data = {"m" : m,"t" : t,"p" : p}
  }

  return {
    urls:configUrlMap,
    screenSize:calScreenWidth,
    appState:appState,
    methods:{
      produceSeperateWineHtml : produceSeperateWineHtml,
      getSearchArgFromUrl :     getSearchArgFromUrl,
      deviceInfo : deviceInfo,
      appVersion : appVersion,
      timestamp : timestamp,
      getBasicUserinfo : getUserinfoData,
      appAjax : appAjax
    }
  }

  function produceSeperateWineHtml(currentWine,wrap,wineIndex,moduleIndex,moduleLength,wineLength,moduleId) 
  {
    //console.log("arguments.length = " + arguments.length)
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



    // $awinePic = $("<a class='wine-detail' href='detail.html?moduleId="+moduleId+"&id="+currentWine['id']+"'></a>")
    $awinePic = $("<a class='wine-detail' href='detail.html?id="+currentWine['id']+"' data-id="+currentWine['id']+"></a>")
    $spanMailInfo = $("<span class='mail-info'>"+currentWine['discount']+"</span>") //满200包邮 => 酒款上部
    $spanCntInfo = $("<span class='cnt-info'>"+currentWine['shortage']+"</span>") //仅剩6 => 酒款上部
    console.log(currentWine['pics']);
    $img = $("<img class='wine-img' src='"+currentWine['pics'][0]['pic']+"'>") //酒款图片 => 酒款上部
    $img.css({
      width: imgWidth,
      height:imgHeight
    })

    $spanSubtitle = $("<span class='subtitle'>"+currentWine['subtitle']+"</span>") //副标题 => 酒款上部

    $divHeadline = $("<div>"+currentWine['title']+"</div>") //主描述 => 酒款下部
    $spanCurrentPrice = $("<span>"+currentWine['market']+"</span>")//现价 => 酒款下部
    $spanOriginalPrice = $("<del>"+currentWine['price']+"</del>")//原价 or 其他标注 => 酒款下部
    $spanRecom = $("<span>"+currentWine['limit']+"</span>")//主描述 => 提示

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