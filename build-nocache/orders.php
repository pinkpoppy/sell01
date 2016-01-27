<?php
  require_once('check.php');
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>我的订单</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=0.5 maximum-scale=-1.0,user-scalable=no">
    <!-- 引入 jquery mobile css 开始-->
  <!-- <link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" /> -->
  <link rel="stylesheet" href="http://apps.bdimg.com/libs/jquerymobile/1.4.5/jquery.mobile-1.4.5.min.css">
  <!-- 引入 jquery mobile css 结束-->

  <!-- 引入 jquery 开始 -->
  <script src="//cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
  <!-- 引入 jquery 结束 -->

  <!-- 共有 css/js 开始 -->
  <link rel="stylesheet" href="main.css">
  <script src="main.js"></script>
  <!-- 共有 css/js 结束 -->

  <!-- 私有 js 开始 -->
  <script src="../app/js/privatejs/orders.min.js"></script>
  <!-- 私有 js 结束 -->
  <script type="text/javascript" defer src="utilities.min.js"></script>
</head>

<body>
  <div class="wrap">
    <div data-rol="page">
      <header class="orders-header">
        <div id="0" class="tab-wrap">
          <a href="#page-all">全部</a>
        </div>
        <div id="1" class="tab-wrap">
          <a href="#page-wait-payed">代付款</a>
        </div>
        <div id="2" class="tab-wrap">
          <a href="#page-wait-send">代发货</a>
        </div>
        <div id="3" class="tab-wrap">
          <a href="#page-wait-receive">代收货</a>
        </div>
      </header>

      <div data-role="page" id="page-all" class="each-page">
         <div data-role="main" class="ui-content">全部订单页面</div>
      </div>

      <div data-role="page" id="page-wait-payed" class="each-page">
        <div data-role="main" class="ui-content">代付款</div>
      </div>

      <div data-role="page" id="page-wait-send" class="each-page">
        <div data-role="main" class="ui-content">代发货</div>
      </div>

      <div data-role="page" id="page-wait-receive" class="each-page">
        <div data-role="main" class="ui-content">代收货</div>
      </div>

    </div>
  </div>
</body>
</html>