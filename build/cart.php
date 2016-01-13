<?php
  require_once('check.php');
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>购物车</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=0.5 maximum-scale=-1.0,user-scalable=no">

  <!-- 引入 jquery 开始 -->
  <script src="//cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
  <!-- 引入 jquery 结束 -->



  <!-- 共有 css/js 开始 -->
  <link rel="stylesheet" href="main.css">
  <script src="main.js"></script>
  <!-- 共有 css/js 结束 -->

  <!-- 私有 js 开始 -->
  <script src="privatejs/cart.js"></script>
  <!-- 私有 js 结束 -->
</head>

<body>
  <div class="wrap" data-role="page">
    <div data-role="content">
      <ul data-role="listview" class="swipe-delete cart-listview">
      </ul>
    </div>

    <section class="money-bar shopping-bar">
      <div class='cart-left'>
        <input type='button' class='goods-choosen' id='cart-all'>
        <span>全选</span>
      </div>
      <ul class='cart-mid' id="cart-mid">
        <li class='price'>金额￥<span id='total'></span></li>
        <li class='mail-info'>不计运费和优惠</li>
      </ul>
      <div class='money-bar-right'>
        <button id="checkout"></button>
      </div>
    </section>
    <!-- <div class="empty-cart">
      购物车没有商品噢,去首页逛逛吧
      <a href="home.html">去逛逛</a>
    </div> -->
  </div>
  <div class="modal-wrap">
    <div class="modal-body common">
      <button class="modal-close wx-modal-c" id="wx-modal-close">关闭</button>
      <header>
        <h3>绑定手机号</h3>
        <span>绑定手机号后，可同步购物车和订单</span>
        </hr>
      </header>
      <section>
        <div class="input-wrap bd-r">
          <span class="lebel">手机号</span>
          <input type="text" id="wx-tel-input">
        </div>
        <div class="neck-div">
          <div>
            <span class="lebel bd-r">验证码</span>
            <input type="text" class="bd-r" id="bind-code-input">
          </div>
          <button id="wx-send-code" class="bd-r">获取验证码</button>
        </div>
        <button id="wx-confirm-binding" class="bd-r">确认</button>
      </section>
      <span id="wx-err-msg" class="bd-r"></span>
    </div>
  </div>
</body>
</html>