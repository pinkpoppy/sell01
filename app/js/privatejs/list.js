
jQuery(document).ready(function($) {
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
      var h = Math.ceil(cnt / 2) * liH + 51
      $('#scroller').css('height', h);
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


var myScroll,
  pullDownEl, pullDownOffset,
  pullUpEl, pullUpOffset,
  generatedCount = 0;

function pullDownAction () {
  setTimeout(function () {  // <-- Simulate network congestion, remove setTimeout from production!
    var el, li, i;
    el = document.getElementById('#wine-list-ul');

    for (i=0; i<3; i++) {
      li = document.createElement('li');
      li.innerText = 'Generated row ' + (++generatedCount);
      el.insertBefore(li, el.childNodes[0]);
    }
    
    myScroll.refresh();   // Remember to refresh when contents are loaded (ie: on ajax completion)
  }, 1000); // <-- Simulate network congestion, remove setTimeout from production!
}

$('#scroller').css('property', 'value');
function pullUpAction () {
  setTimeout(function () {  // <-- Simulate network congestion, remove setTimeout from production!
    var el, li, i;
    el = document.getElementById('#wine-list-ul');

    for (i=0; i<3; i++) {
      li = document.createElement('li');
      li.innerText = 'Generated row ' + (++generatedCount);
      el.appendChild(li, el.childNodes[0]);
    }
    
    myScroll.refresh();   // Remember to refresh when contents are loaded (ie: on ajax completion)
  }, 1000); // <-- Simulate network congestion, remove setTimeout from production!
}

function loaded() {
  pullDownOffset = 0
  pullUpEl = document.getElementById('pullUp'); 
  pullUpOffset = pullUpEl.offsetHeight;
  
  myScroll = new iScroll('wrap', {
    useTransition: true,
    topOffset: pullDownOffset,
    onRefresh: function () {
      // if (pullDownEl.className.match('loading')) {
      //   pullDownEl.className = '';
      //   pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
      // } else if (pullUpEl.className.match('loading')) {
      //   pullUpEl.className = '';
      //   pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
      // }
      if(pullUpEl.className.match('loading')) {
        pullUpEl.className = '';
        pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
      }
    },
    onScrollMove: function () {
      if (this.y > 5 && !pullDownEl.className.match('flip')) {
        pullDownEl.className = 'flip';
        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
        this.minScrollY = 0;
      } else if (this.y < 5 && pullDownEl.className.match('flip')) {
        pullDownEl.className = '';
        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
        this.minScrollY = -pullDownOffset;
      } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
        pullUpEl.className = 'flip';
        pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
        this.maxScrollY = this.maxScrollY;
      } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
        pullUpEl.className = '';
        pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
        this.maxScrollY = pullUpOffset;
      }
    },
    onScrollEnd: function () {
      if (pullDownEl.className.match('flip')) {
        pullDownEl.className = 'loading';
        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';        
        pullDownAction(); // Execute custom function (ajax call?)
      } else if (pullUpEl.className.match('flip')) {
        pullUpEl.className = 'loading';
        pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';        
        pullUpAction(); // Execute custom function (ajax call?)
      }
    }
  });
  
  setTimeout(function () { document.getElementById('wrap').style.left = '0'; }, 800);
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
});