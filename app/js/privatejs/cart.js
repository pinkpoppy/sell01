jQuery(document).ready(function($) {
  var 
  userData = function jointUserinfo() {
    var userinfo = app.methods.getBasicUserinfo() 
    return JSON.stringify(userinfo) 
  }
  app.methods.appAjax("获取用户购物车列表",
    "cart",
    "POST",
    userData(),
    app.methods.timestamp(),
    getCartSucceed,
    getCartFailed)

  function insertDom(data){
    var $wrap = $('.swipe-delete')
    for (var i= 0, l = data.length; i < l; i++) {
      //TODO 列表点击后的跳转,先不做
      var 
        link = "https://www.baidu.com"
        $list = $("<li>"
                    +"<div class='behind'>"
                      +"<a href='#' class='ui-btn delete-btn'>删除</a>"
                    +"</div>"
                    +"<a href='#' class='goods-cont'>"
                      +"<div>"
                        +"<div class='cart-left'>"
                          +"<input type='radio'>"
                          +"<img src='"+data[i]['pics'][0]['pic']+"'>"
                        +"</div>"
                        +"<div class='cart-right'>"
                          +"<dl>"
                            +"<dt>"+data[i]['title']+"</dt>"
                            +"<dd>"+data[i]['inventory']+"</dd>"
                          +"</dl>"
                          +"<ul>"
                            +"<li>"+data[i]['price']+'&yen;'+"</li>"
                            +"<li><button type='button' class='op cart-minus-op'>-</button></li>"
                            +"<li>"+data[i]['quantity']+"</li>"
                            +"<li><button type='button' class='op cart-plus-op'>+</button></li>"
                          +"</ul>"
                        +"</div>"
                      +"</div>"
                    +"</a>"
                  +"</li>")
      $wrap.append($list)

      $('.cart-minus-op').on('click',function(event) {
        console.log('minus ok')    
      });

      $('.cart-plus-op').on('click',function(event) {
       console.log('plus ok')    
     });
  
    }
  }

  

  function getCartSucceed(response){
    //TODO if 购物车没有商品,展示那个空白页面
    insertDom(response['goods'])
  }

  function getCartFailed(response){

  }

  // swipe to delete partial start
  function prevent_default(e) {
    e.preventDefault();
  }

  function disable_scroll() {
    $(document).on('touchmove', prevent_default);
  }

  function enable_scroll() {
    $(document).unbind('touchmove', prevent_default)
  }

  var x

  $('.swipe-delete li > a')
  .on('touchstart', function(e) {
    $('.swipe-delete li > a.open').css('left', '0px').removeClass('open')
    $(e.currentTarget).addClass('open')
    x = e.originalEvent.targetTouches[0].pageX 
  })
  .on('touchmove', function(e) {
    var change = e.originalEvent.targetTouches[0].pageX - x
    change = Math.min(Math.max(-100, change), 100) 
    e.currentTarget.style.left = change + 'px'
    if (change < -10) disable_scroll() 
  })
  .on('touchend', function(e) {
    var left = parseInt(e.currentTarget.style.left)
    var new_left;
    if (left < -35) {
      new_left = '-100px'
    } else if (left > 35) {
      new_left = '100px'
    } else {
      new_left = '0px'
    }
    $(e.currentTarget).animate({left: new_left}, 200)
    enable_scroll()
  });

  $('li .delete-btn').on('touchend', function(e) {
    e.preventDefault()
    $(this).parents('li').slideUp('fast', function() {
      $(this).remove()
    })
  })
  // swipe to delete partial end
});