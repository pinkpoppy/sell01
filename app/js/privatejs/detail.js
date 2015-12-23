jQuery(document).ready(function($) {

  var 
    gId = app.methods.getSearchArgFromUrl()['id']
    userData = function jointUserinfo() {
      var userinfo = app.methods.getBasicUserinfo()
      if (isLegalGoodsId(gId) ) {
        userinfo['gid'] = arguments[0]
      }
      if (arguments.length == 1) { 
        //only gId parameter,loads wine info
      } else if (arguments.length == 2) { 
        //gId and quantity,add wine to basket
        userinfo['quantity'] = arguments[1]
      }
       return JSON.stringify(userinfo) 
    }

    des = '请求酒款详情'
    methodName = 'getGoods'
    requestType = 'POST'

  app.methods.appAjax(des,
                      methodName,
                      requestType,
                      userData(gId),
                      app.methods.timestamp(),
                      function(data){
    (function(imgArr) {
      var parent =  $('.unslider-wrap')

      for(var i = 0,len = imgArr.length; i < len; i++) {
        var li = $("<li class='unslider-active'></li>"),
            img = $("<img src='"+imgArr[i]['pic']+"'>")
        li.append(img)
        parent.append(li)
      }
    })(data.goods.pics);

    // 轮播图
    $('.unslider').unslider({
      animation: 'fade',
      autoplay: true,
      arrows: false
    });

    (function showWineData(data) {
      $('.detail-headline-left').text(data['title'])
      $('.price-right span').text(data['market'])
      $('.price-right del').text(data['price'])

      $('.other-attr .sales-cnt').text("销量 " + data['sold'])
      $('.other-attr .supply').text("库存 " + data['inventory'])
      $('.other-attr .time-or-restrict').text(data['limit'])

      var isInActity = function() {
        return !$.isEmptyObject(data.ad)
      }
      if (isInActity()) {
        $('.in-activity a').attr('href', data.ad['url'])
        $('.in-activity a').text(data.ad['name'])
      } else {
         $('.in-activity').remove()
      }
    })(data.goods);

    //set shopping cart's href
    $('#detail-basket').attr('href', 'cart.html?id='+gId);
    // 商品介绍 开始
    (function showWineIntro (introArr){
      $wrap = $('.detail-wine-intro') //DOM中的包裹元素

      for (var i = 0, l = introArr.length; i < l; i++) {
        var
          wrap = $("<div class='intro-wrap'></div>"),
          img = $("<img class='intro-pic' src='"+introArr[i]['image']+"'>"),
          txt = $("<div class='intro-cont'>"+introArr[i]['text']+"</div>")
        wrap.append(img)
        wrap.append(txt)
        $wrap.append(wrap)
      }
    })(data.goods.intro);
    // 商品介绍 结束
  });
  
  function isLegalGoodsId(gId) {
    if (gId) {
      return true
    } else {
      alert("非法商品 ID")
      return false
    }
  }

  // 购物车相关 开始
  var
    gNum = 1
    basketNum = 0
    $showNum = $('#show-number')
    $basketNum = $('#goods-num')


  $('#plus').click(function(event) {
    if (isLegalGoodsId(gId)) {
      $showNum.text(++gNum)
    }
  })

  $('#minus').click(function(event) {
    if (isLegalGoodsId(gId)) {
      if (gNum > 1) {
        $showNum.text(--gNum)
      }
    }
    //TODO gNum== 1 minus button disabled
  })

  $('#add-goods').click(function(event) {
    //TODO gId,gNum ajax请求
    //TODO succeed basketNum += gNum
    //TODO failed alert("添加失败,重新添加")
    function addCartSucceed(response){
      var temp = parseInt(gNum + basketNum)
      $basketNum.text(parseInt($basketNum.text()) + gNum)
    }
    function addCartFailed(response) {
      //TODO 添加购物车失败
    }
    app.methods.appAjax("加入购物车操作",
                        'addCart',
                        requestType,
                        userData(gId,gNum),
                        app.methods.timestamp(),
                        addCartSucceed)
  })

  $('#detail-basket').click(function(event) {
     
  });
  $('#immediate-buy').click(function(event) {
    
  })
  // 购物车相关 结束
});