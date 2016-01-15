<?php
  require_once('check.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>商品详情</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=0.5 maximum-scale=-1.0,user-scalable=no">

  <!-- 引入 jquery 开始 -->
  <script src="//cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
  <!-- 引入 jquery 结束 -->

  <!-- 共有 css/js 开始 -->
  <link rel="stylesheet" href="main.css">
  <script src="main.js"></script>
  <!-- 共有 css/js 结束 -->

  <!-- 私有 js 开始 -->
  <script src="privatejs/detail.js"></script>
  <!-- 私有 js 结束 -->
</head>
<body>
  <div class="wrap">

    <!-- 轮播图 开始 -->
<!--     <div class="unslider">
      <ul class="unslider-wrap">
      </ul>
    </div> -->
    <!-- 轮播图 结束 -->

    <section class="detail-wine-info">
      <div class="main-info-wrap">
        <div class="price-right inline-div">
          <span></span>
          <del></del>
        </div>
        <div class="detail-headline-left inline-div"></div>
      </div>
      

      <div class="other-attr">
        <p class="sales-cnt"></p>
        <p class="supply"></p>
        <p class="time-or-restrict"></p>
      </div>

      <div class="in-activity">
        <a href="https://www.baidu.com">活动</a>
        <!-- <span>活动></span> -->
      </div>

      <section class="detail-wine-intro">
        <div class="intro-header">
          <span>商品介绍</span>
          <div>
            <span></span>
            <a href="">客服</a>
          </div>
          <i></i>
        </div>
      </section>

      <div class="shopping-bar">
        <div class="op-wrap">
          <button class="op" id="minus">-</button>
          <button class="show-cnt op" id="show-number">1</button>
          <button class="op" id="plus">+</button>
          <button class="buy-button" id="add-goods">加入购物车</button>
          <button class="buy-button" id="immediate-buy">立即购买</button>
        </div>
      </div>
    </section>

    <a id="detail-basket">   
      <span id="goods-num">0</span>
    </a>
  </div>
</body>
</html>