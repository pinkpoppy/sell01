alert("1")
// var app = (function(){
//   /*
//   * 0 全部订单 1 代付款 2 代发货 3 代收货
//   */
//   alert("2");
//   var 
//     configUrlMap = {
//       APIBase : "http://t.snapwine.net:7784/pjapi/"
//     },
//     config = {
//       Base64Key:"RkVB2p5ida3ywUDJf7IgXcoGrm8TjOEAb",
//       userId :localStorage['userId'],
//       userType : "12",
//       headPic:localStorage['headPic'],
//       nickname:localStorage['nickname'],
//       sex:localStorage['sex'],
//       intro:'',
//       country:localStorage['country'],
//       pro:localStorage['province'],
//       city:localStorage['city'],
//       dis:'',
//     },

//     localArr = ['n','t','p','c','d','de'],

//     browser = {
//       versions : function(){
//         var 
//           u = window.navigator.userAgent,
//           app = window.navigator.appVersion;
//         return {
//           trident: u.indexOf('Trident') > -1, //IE内核
//           presto: u.indexOf('Presto') > -1, //opera内核
//           webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
//           gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
//           mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
//           ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
//           android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
//           iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
//           iPad: u.indexOf('iPad') > -1, //是否iPad
//           webApp: u.indexOf('Safari') == -1 //是否web应用程序，没有头部与底部
//         }
//       }(),
//       language:(navigator.browserLanguage || navigator.language).toLowerCase()
//     };
//   alert("3")
//   var 
//     moduleId = 1,
//     pageId = 1; 
//   alert("4")
//   var 
//     appState = {
//       module:moduleId,
//       page:pageId,
//       storageType:"localStorage",
//       storageArr:localArr
//     };
//   alert("5")
//   function calScreenWidth(){
//     return screen.width
//   }

//   function calScreenHeight(){
//     return screen.height
//   }
  
//   function getSearchArgFromUrl(){
//     var searchString = window.location.search
//     var res = {}
//     if (searchString.length > 0) {
//       var argArr = searchString.substr(1,searchString.length -1 ).split('&')
      
//       for (var i = 0; i < argArr.length; i++) {
//         var coupleArg = argArr[i].split('=')
//         console.log(coupleArg)

//         res[coupleArg[0]] = coupleArg[1]
//       }
//     }
//     return res
//   }
  
//   function deviceInfo(){
//     var 
//       devicePlat = browser.versions,
//       device = "";
//     if (devicePlat.ios) {
//        device = "iphone"
//     } else if (devicePlat.android) {
//       device = "android"
//     }
//     return device
//   }  

//   function browserInfo(){
//     if (browser.versions.mobile) {
//       var ua = navigator.userAgent.toLowerCase()
//       if (ua.match(/MicroMessenger/i) == "micromessenger") {
//         return "weixin"
//       } else if (ua.match(/WeiBo/i) == "weibo") {
//         return "weibo"
//       } else if (ua.match(/QQ/i) == "qq") {
//         return qq
//       } else if (browser.versions.ios) {
//         return "ios"
//       } else if (browser.versions.android) {
//         return "android"
//       }
//     } else {
//       return "pc"
//     }
//   }

//   function appVersion(){
//     var version = "2.2.0"
//     return version
//   }

//   function timestamp(){
//     return parseInt(new Date() / 1000)
//   }

//   function ajaxLog(path,des,feedback) {
//     console.log(path +" "+ des +" " + feedback)
//   }

//   function pathInfo(addPath){
//     var
//       l = window.location,
//       host = l.protocol + "//" + l.host,
//       pathname = l.pathname,
//       path = pathname.substring(0,pathname.lastIndexOf('/')+1),
//       newPathName = host + path + addPath;

//     return newPathName
//   }

//   function initStorage(type) {
//     try {
//       var 
//         storage = window[type];
//       return true
//     }
//     catch(e) {
//       alert("错误类型: " + e.name)
//       return false
//     }
//   }
//   function AES(plainText,timestamp) {

//     pkcs7 = function(str) {
//       var len = str.length,
//           block_size = 32,
//           pad = block_size-(len % block_size),
//           padChar=String.fromCharCode(pad);

//       for (var i = 0; i < pad; i++) {
//         str = str + padChar
//       }
//       return str
//     }

//     var Base64Key = config['Base64Key'] + timestamp + '=',
//         key = CryptoJS.enc.Base64.parse(Base64Key),
//         iv = key.left(16);

//     plainText = unescape(encodeURIComponent(plainText))
//     var text=CryptoJS.enc.Latin1.parse(pkcs7(plainText));
//         ciphertext = CryptoJS.AES.encrypt(text, 
//                                           key, 
//                                           {iv: iv, 
//                                             mode:CryptoJS.mode.CBC, 
//                                             padding:CryptoJS.pad.NoPadding}),
//         base64Text = CryptoJS.enc.Base64.stringify(ciphertext.ciphertext)
//     return base64Text
//   }

//   /**
//   *@param Des descripption of the request String
//   *@param MethodName specific API name of current request String
//   *@param RequestType GET/POST or Other Type String
//   *@param userData JSON
//   *@param Timestamp Current Timestamp an 10bit Interger
//   */
//   function appAjax(des,
//                    methodName,
//                    requestType,
//                    userData,
//                    timestamp,
//                    succeedCallback
//                    ) {
//     var 
//       path = configUrlMap['APIBase'],
//       data = jointPostData(methodName,timestamp,AES(userData,timestamp));
//     $.ajax({
//       url : path,
//       method : requestType,
//       dataType : 'json',
//       data : data
//     })
//     .done(function(data) {
//       ajaxLog(path,des,'successed')
//       //var json = JSON.parse(JSON.stringify(eval( "(" + data +")")))
//       //callBack(json)
//       succeedCallback(data)
//     })
//     .fail(function(data) {
//       //failedCallback(data)
//       ajaxLog(path,des,'failed')
//     })
//     .always(function(data) {
//       //alwaysCallback(data)
//       ajaxLog(path,des,'completed')
//     });
//   }

//   /**
//   *   
//   */
//   function getUserinfoData(){
//     var u = {};
//     u.userId = config.userId
//     u.userType = config.userType
//     u.headPic = config.headPic
//     u.nickname = config.nickname
//     u.sex = config.sex
//     u.intro = config.intro
//     u.version = appVersion()
//     u.deviceMode = deviceInfo()
//     console.log("u in getUserinfoData " + u.userId)
//     return u
//   }

//   /**
//   * @m API method name
//   * @t timestamp using for AES
//   * @p base64text representing the sensitive user info
//   */
//   function jointPostData(m,t,p) {
//     return data = {"m" : m,"t" : t,"p" : p}
//   }
//   alert("6")
//   return {
//     urls:configUrlMap,
//     screenSize:calScreenWidth,
//     appState:appState,
//     config:config,
//     methods:{
//       produceSeperateWineHtml : produceSeperateWineHtml,
//       getSearchArgFromUrl :     getSearchArgFromUrl,
//       deviceInfo : deviceInfo,
//       appVersion : appVersion,
//       timestamp : timestamp,
//       getBasicUserinfo : getUserinfoData,
//       appAjax : appAjax,
//       browser : browserInfo,
//       pathInfo : pathInfo,
//       setBgImage :setBgImage,
//       initStorage,initStorage,
//       localArr:localArr,
//       setModalMask:setModalMask,
//       isLegalMobilePhone : isLegalMobilePhone
//     }
//   }
//   alert("7")
//   function setBgImage(str) {
//     if (str.search('focus') != -1) {//点击的时候是选中状态
//       str = str.replace('focus','blur')
//     } else if (str.search('blur') != -1) { //点击的时候是未选中状态
//       str = str.replace('blur','focus')
//     }
//     return str
//   }
//   alert("8")
//   function produceSeperateWineHtml(currentWine,wrap,wineIndex,moduleIndex,moduleLength,wineLength,moduleId) 
//   {
//     var itemHeight = 0;
//     //console.log("arguments.length = " + arguments.length)
//     if (arguments.length==5) {
//       currentWine = arguments[0],
//       wrap = arguments[1],
//       wineIndex = arguments[2],
//       wineLength = arguments[3],
//       moduleId = arguments[4];
//     }
//     var 
//       screenWidth = app.screenSize(),
//       imgWidth = liWidth = parseInt(parseInt((screenWidth - 26) / 2)),
//       ratio = 1.0, //图片原始的高宽比:432 / 720 = 0.6
//       imgHeight = Math.ceil(imgWidth * ratio),
//       liBottomHeight = 70,
//       liHeight = imgHeight + liBottomHeight,

//     $li = $("<li></li>"),
//     $wineWrap = $("<div class='wine-wrap'></div>"), //包住酒款
//     $divUp = $("<div class='div-up'></div>"), //酒款上部
//     $divBottom = $("<div class='div-bottom'></div>"), //酒款下部

//     $awinePic = $("<a class='wine-detail' href='"
//                     +pathInfo("detail.php?id=")
//                     +currentWine['id']
//                     +"'data-id='"
//                     +currentWine['id']
//                     +"'></a>"),

//     $spanMailInfo = $("<span class='mail-info'>"+currentWine['discount']+"</span>"), //满200包邮 => 酒款上部
//     $spanCntInfo = $("<span class='cnt-info'>"+currentWine['shortage']+"</span>"); //仅剩6 => 酒款上部
    
//     if (currentWine['pics'].length!=0) {
//       $img = $("<img class='wine-img' src='"+currentWine['pics'][0]['pic']+"'>") //酒款图片 => 酒款上部
//     } else {
//       $img = $("<img class='wine-img' src=''>") //酒款图片 => 酒款上部
//     }
    
//     $img.css({
//       width: imgWidth,
//       height:imgHeight
//     })

//   var 
//     $spanSubtitle = $("<span class='subtitle'>"+currentWine['subtitle']+"</span>"), //副标题 => 酒款上部

//     $divHeadline = $("<div>"+currentWine['title']+"</div>"), //主描述 => 酒款下部
//     $spanCurrentPrice = $("<span class='market'>"+'&yen;'+currentWine['market']+"</span>"),//现价 => 酒款下部
//     $spanOriginalPrice = $("<del>"+currentWine['price']+"</del>"),//原价 or 其他标注 => 酒款下部
//     $spanRecom = $("<span>"+currentWine['limit']+"</span>"),//主描述 => 提示
    
//     $awinePic.append($img),
//     $divUp.append($awinePic),
//     $divUp.append($spanMailInfo),
//     $divUp.append($spanCntInfo),
//     $divUp.append($spanSubtitle),


//     $divBottom.append($divHeadline),
//     $divBottom.append($spanCurrentPrice),
//     $divBottom.append($spanOriginalPrice),
//     $divBottom.append($spanRecom),

//     // 设置 divUp 以及 divBottom 的高度
//     $divUp.css('height', imgHeight),
//     $divBottom.css('height', liBottomHeight),
//     $awinePic.css('height', imgHeight),

//     $wineWrap.append($divUp),
//     $wineWrap.append($divBottom),
//     $li.append($wineWrap);


//     var 
//       y = parseInt(wineIndex / 2) * liHeight,
//       base = 42,
//       liMargin = 15,
//       rightColumnStart = 8 + liWidth + 10;
//     if (wineIndex == 0) {
//       $li.css({
//         left: '8',
//         top:y + base
//       });
//     } else if (wineIndex % 2 == 0 && wineIndex !== 0) {
//       $li.css({
//         left: '8',
//         top:y + base + liMargin * parseInt(wineIndex / 2)
//       });
//     } else if (wineIndex % 2 == 1) {
//       if (wineIndex == 1) {
//         $li.css({
//           left: rightColumnStart,
//           top: y + base
//         });
//       } else{
//         $li.css({
//           left: rightColumnStart,
//           top: y + base + liMargin * parseInt(wineIndex / 2)
//         })
//       }
      
//     }

  
//     $wineWrap.css('width', liWidth)
    
//     $(wrap).append($li)
//     itemHeight = Math.ceil(parseFloat($li.css('height')))

//     if (arguments.length == 7){
//       // if i === 最后一行 && j === 最后一行 添加 margin
//       if (moduleIndex == moduleLength - 1 && 
//           ((wineIndex == wineLength - 1) || (wineIndex == wineLength - 2))) {
//           $li.addClass('last-wine-item')
//         }
//     } else if (arguments.length == 6) {
//       console.log("arguments.length: "+arguments.length)
//       if (wineIndex == wineLength-1 || wineIndex == wineLength - 2) {
//         $li.addClass('last-wine-item')
//       }
//     }

//     return itemHeight
//   }
//   // 432 / 720 = 0.6
//   //下面是最后的});
//   //设置模态对话框遮罩层宽高
//   function setModalMask(ele) {
//     var 
//       screenW = parseFloat(calScreenWidth()),
//       screenH = parseFloat(calScreenHeight()),
//       boxW = Math.ceil(parseFloat(screenW * 0.84)),
//       boxH = Math.ceil(parseFloat(screenH * 0.46));
//     $(ele).css('width',screenW+'px')
//     $(ele).css('height',screenH+'px')
//     $(ele).children('.modal-body').css('width',boxW + 'px')
//     $(ele).children('.modal-body').css('height',boxH + 'px')
//   }

//   //表单验证
//   function isInputEmpty(str){
//     if (str.length == 0) {
//       return true
//     }
//   }

//   function isLegalMobilePhone(str) {
//     var
//       mpReg = /1[^0126][0-9]{9}/;
//     if (isInputEmpty(str)) {
//       return "EMPTY"
//     } else {
//       if (mpReg.test(str)) {
//         return true
//       }
//       return false
//     }
//   }
//   alert("9")
// })();
// alert("10")