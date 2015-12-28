var ready
ready = function() {
  console.log(1+1)
}

$(document).ready(ready);
$(document).on('page:load', ready)