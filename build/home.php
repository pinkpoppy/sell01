<?php
	require_once('check.php');
	require_once('auth.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>首页</title>
	<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0 maximum-scale=-1.0,user-scalable=no">
	
	<!-- 引入 jquery 开始 -->
	<script src="//cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
	<!-- 引入 jquery 结束 -->

	<!-- 共有 css/js 开始 -->
	<link rel="stylesheet" href="main.css">

	<script src="main.js"></script>
	<!-- 共有 css/js 结束 -->

	<script>
		var u = '<?php echo $userInfo;?>'
		if (u) {
			u = JSON.parse(u)
			var sex = u['sex']
			if (sex=='1') {
				sex = '男'
			} else if (sex=='2') {
				sex = '女'
			} else {
				sex = '其他'
			}
			app.config.userId = u['openid']
			app.config.headPic = u['headimgurl']
			app.config.nickname = u['nickname']
			app.config.sex = sex
			app.config.country = u['country']
			app.config.pro = u['province']
			app.config.city['city']
		}
	</script>
	<!-- 私有 js 开始 -->
	<script src="privatejs/home.js"></script>
	<!-- 私有 js 结束 -->
</head>
<body>
	<div class="wrap">
		<!-- 头部 开始 -->
		<section class="header"></section>
		<!-- 头部 结束 -->


		<!-- 轮播图 开始 -->
<!-- 		<div class="unslider">
			<ul class="unslider-wrap">
			</ul>
		</div> -->
		<section class="notify"></section>
		<!-- 轮播图 结束 -->


		<!-- 特卖模块 开始 -->
		<section class="home-special-sell-wrap">
		</section>
		<!-- 特卖模块 结束 -->


		<!-- 底部 Tabbar 开始 -->
<!-- 		<section class="bottom">
			<a href="#" class="option">
				<span class="">
				</span>
				<p>首页</p>
			</a>
			<a href="#" class="option">
				<span class="">
				</span>
				<p>购物车</p>
			</a>
			<a href="#" class="option">
				<span class="">
				</span>
				<p>我的订单</p>
			</a>
		</section> -->
		<!-- 底部 Tabbar 结束 -->

	</div>
</body>
</html>