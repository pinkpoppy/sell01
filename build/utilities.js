var utilities = function(){}
utilities.randomQueryString = function(){
  function random(){
    var bound = 10000
    return parseInt(Math.random() * bound)
  }

  var 
    scripts = document.getElementsByTagName('scripts'),
    queryID = random()
    console.log(scripts.length)
  for (var i = 0,l = scripts.length; i < l; i++) {
    var src = scripts[i].getAttribute('src')
    if (src) {
      console.log(src)
      if (src.search('?v=') !== -1) {
        src.replace('?v=','?v='+queryID)
        scripts[i].setAttribute(src)
      } else {
        scripts[i].setAttribute(src + "?v=" + queryID)
        console.log(scripts[i].getAttribute('src'))
      }
    }
  }
}

utilities.randomQueryString()