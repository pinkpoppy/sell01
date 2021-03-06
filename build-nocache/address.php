<?php
  require_once('check.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>编辑收获地址</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <style rel="stylesheet" src="main.css"></style>

  <script src="//cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
  <script src="main.js"></script>
  <script src="privatejs/add.js"></script>
  <script type="text/javascript" defer src="utilities.js"></script>
  <link rel="stylesheet" href="main.css">
</head>
<body>
  <div class="wrap">
    <form class="address-form">
      <table>
        <tbody>
          <tr>
            <td class="static-txt">收货人姓名</td>
            <td class="cont">
              <input type="text" id="fill-name" class="cont-txt">
            </td>
          </tr>

          <tr>
            <td class="static-txt">联系电话</td>
            <td class="cont">
              <input type="text" id="fill-tel" class="cont-txt">
            </td>
          </tr>

          <tr>
            <td class="static-txt">区域选择</td>
            <td class="cont">
              <div id="element_id">
                <select class="province" id="fill-p" data-value="" class="cont-txt">
                  <!-- <option value="上海" selected>上海</option> -->
                </select>
                <select class="city" id="fill-c" data-value=""class="cont-txt" >
                  <!-- <option value="上海市" selected >上海市</option> -->
                </select>

                <select class="area" id="fill-d" data-value="" class="cont-txt">
                  <!-- <option value="上海市" selected>浦东新区</option> -->
                </select>
              </div>
            </td>
          </tr>

          <tr>
            <td class="static-txt">详细地址</td>
            <td class="cont">
              <input placehold="请输出详细地址，方便寄送" id="fill-de" class="cont-txt">
            </td>
          </tr>
        </tbody>
      </table>
      <div class='footer'>
        <div class='tips'>仅限中国大陆地区,因为天气原因以下地方暂不发货,黑龙江 内蒙古 辽宁 吉林</div>
        <div class='save'>
          <button id="add-save">保存</button>
        </div>
      </div>
    </form>
  </div>
</body>
</html>