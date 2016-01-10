jQuery(document).ready(function($){
  $.cxSelect.defaults.url = '../app/resources/json/cityData.json'
  $.cxSelect.defaults.nodata = 'none'

  $('#element_id').cxSelect({
    selects:['province','city','area']
  });

  var 
  	storage = app.appState.storageType
  	isStorageAvailable = app.methods.initStorage(storage)
  	keyArr = app.appState.storageArr
  if (isStorageAvailable) {
  	s = window[storage]
  	if (s.length == 6) {
	  	var 
	  		nn = s.getItem(keyArr[0])
	  		tt = s.getItem(keyArr[1])
	  		pp = s.getItem(keyArr[2])
	  		cc = s.getItem(keyArr[3])
	  		dd = s.getItem(keyArr[4])
	  		dede = s.getItem(keyArr[5])
	  	nn && nn != "undefined" ? $("#fill-name").val(nn):$("#fill-name").val("")
	  	tt && tt != "undefined" ? $("#fill-tel").val(tt):$("#fill-tel").val("")
	  	pp && pp != "undefined" ? $("#fill-p").attr("data-value",pp):$("#fill-p").attr("data-value","")
	  	cc && cc != "undefined" ? $("#fill-c").attr("data-value",cc):$("#fill-c").attr("data-value","")
	  	dd && dd != "undefined" ? $("#fill-d").attr("data-value",dd):$("#fill-d").attr("data-value","")
	  	dede && dede != "undefined" ? $("#fill-de").attr("data-value",dede):$("#fill-de").attr("data-value","")
  	} else {
  		//init storage Object
  		s.setItem(keyArr[0],"")
	  	s.setItem(keyArr[1],"")
	  	s.setItem(keyArr[2],"")
	  	s.setItem(keyArr[3],"")
	  	s.setItem(keyArr[4],"")
	  	s.setItem(keyArr[5],"")
  	} 
	  $('#fill-name').change(function(){
	  	name = $(this).val()
	  	s.setItem(keyArr[0],name)
	  })
	  $('#fill-tel').change(function(){
	  	tel = $(this).val()
	  	s.setItem(keyArr[1],tel)
	  })
	  $('#fill-p').change(function(){
	  	p = $(this).val()
	  	s.setItem(keyArr[2],p)
	  })
	  $('#fill-c').change(function(){
	  	c = $(this).val()
	  	s.setItem(keyArr[3],c)
	  })
	  $('#fill-d').change(function(){
	  	d = $(this).val()
	  	s.setItem(keyArr[4],d)
	  })
	  $('#fill-de').change(function(){
	  	de = $(this).val()
	  	s.setItem(keyArr[5],de)
	  })
  }

  $('#add-save').on('click',function(){
  	history.back()
  })
});