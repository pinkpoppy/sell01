jQuery(document).ready(function($){
  $.cxSelect.defaults.url = '../app/resources/json/cityData.json'
  $.cxSelect.defaults.nodata = 'none'

  $('#element_id').cxSelect({
    selects:['province','city','area']
  });
  
});