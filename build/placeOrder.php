<?php
  require_once('check.php');
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>订单详情</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=0.5 maximum-scale=-1.0,user-scalable=no">
  <!-- 引入 jquery 开始 -->
  <script src="//cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
  <!-- 引入 jquery 结束 -->

  <!-- 共有 css/js 开始 -->
  <link rel="stylesheet" href="main.css">
  <script src="main.js"></script>
  <!-- 共有 css/js 结束 -->

  <!-- 私有 js 开始 -->
  <script src="privatejs/placeOrder.js"></script>
  <!-- 私有 js 结束 -->
</head>

<body>
  <div class="wrap" data-role="page">
    <section class="order-header po-bg-color">
      <div class="order-serial-num"></div>
      <div class="order-time"></div>
      <div class="pay-state"></div>
    </section>
    <div class="tips po-bg-color">请尽快付款</div>
    <section class="person-info po-bg-color">
      <a href="address.php" class="add-person-info">
        <div class="info-left">
          <header>收货信息</header>
          <div class="nm-tel-wrap">
            <div class="name">
              <img src="../app/resources/icon/avatar.png" class="person-i avatar-i">
              <span id="add-person"></span>
            </div>
            <div class="tel">
             <img src="../app/resources/icon/tel.png" class="person-i tel-i">
             <span id="add-tel"></span>
           </div>  
         </div>
         <div class="addr" id="add-add">地址: </div>
       </div>
       <span class="pl-or-arrow"></span>
      </a>
    </section>

    <section class="goods-info po-bg-color">
      <header class="goods-header">
        <span>商品信息</span>
        <button class="po-ask" id="po-ask">联系客服</button>
      </header>
      <div class="order-listview"><ul></ul></div>
    </section>

    <section class="wait-pay-wrap">
      <!-- 代付款 优惠模块 开始 -->
      <section class="other-info-wrap margin-bottom7px">
        <div class="list padding-left15">
          <span>优惠:</span>
          <div>
            <span></span>
            <img src="">
          </div>
        </div>
        <hr>
        <div class="list padding-left15">
          <span>运费:</span>
          <span class="exp-detail">qwq</span>
        </div>
        <hr>
        <div class="list padding-left15">
          <span>供7减</span>
          <span>湿父￥980</span>
        </div>
      </section>
      <section class="note margin-bottom7px po-bg-color">
        <input type="text" id="message" placeholder="备注">
      </section>
      <!-- 代付款 优惠模块 结束 -->
      <!-- 代付款-付款方式栏 开始 -->
      <section class='pay-section margin-bottom7px'>
        <header class="padding-left15 po-bg-color">付款方式</header>
        <hr class="blow-header-hr">
        <div class='pay-item-wrap padding-left15'>
          <span class='pay-bg-icon wx-icon'>
            <span class="pay-name">微信支付</span>
          </span>
          <div class="pay-m-wrap">
            <input type="button" data-c="t" class="pay-radio wx-ra" name="pay" data-m="wx_pub">
          </div>
        </div>
        <hr>
        <div class='pay-item-wrap padding-left15'>
          <span class='pay-bg-icon ali-icon'>
            <span class="pay-name">支付宝</span>
          </span>
          <div class='pay-m-wrap'>
            <input type="button" data-c="nt" class="pay-radio ali-ra" name="pay" data-m="alipay_wap">
          </div>
        </div>
        <hr>
        <div class='pay-item-wrap padding-left15'>
          <span class='pay-bg-icon un-icon'>
            <span class="pay-name">银联支付</span>
          </span>
          <div class='pay-m-wrap'>
            <input type="button" data-c="nt" class="pay-radio un-ra" name="pay" data-m="upacp_wap">
          </div>
        </div>
      </section>
      <!-- 代付款-付款方式栏 结束 -->
      <!-- 代付款-底部 tab 开始-->
      <section class="total-pay po-bg-color">
        <div>
          <span class="sum-money">实付:</span>
          <span class="price-red">&yen;</span>
          <span class="total-cost price-red"></span>
        </div>
        
        <button id="pay">确认支付</button>
      </section>
      <!-- 代付款-底部 tab 结束-->
    </section>
  </div>
</body>
</html>