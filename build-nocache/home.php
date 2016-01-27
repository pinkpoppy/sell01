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
	
	<link rel="stylesheet" href="main.css">
	<script src="//cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
	<script type="text/javascript" src="vendor.min.js"></script>
	<script type="text/javascript" src="app.min.js"></script>
	<script type="text/javascript">
		$(document).ready(function(){
			// var utilities = function(){}
			// utilities.randomQueryString = function(){
			//   function random(){
			//     var bound = 10000
			//     return parseInt(Math.random() * bound)
			//   }

			//   var 
			//     scripts = document.getElementsByTagName('scripts'),
			//     queryID = random()
			//     console.log(scripts.length)
			//   for (var i = 0,l = scripts.length; i < l; i++) {
			//     var src = scripts[i].getAttribute('src')
			//     if (src) {
			//       console.log(src)
			//       if (src.search('?v=') !== -1) {
			//         src.replace('?v=','?v='+queryID)
			//         scripts[i].setAttribute(src)
			//       } else {
			//         scripts[i].setAttribute(src + "?v=" + queryID)
			//         console.log(scripts[i].getAttribute('src'))
			//       }
			//     }
			//   }
			// }
			// utilities.randomQueryString()
			var u = '<?php echo $userInfo;?>';
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
				localStorage.setItem('userId',u['openid'])
				localStorage.setItem('headPic',u['headimgurl'])
				localStorage.setItem('nickname',u['nickname'])
				localStorage.setItem('sex',sex)
				localStorage.setItem('country',u['country'])
				localStorage.setItem('pro',u['province'])
				localStorage.setItem('city',u['city'])

				app.config.userId = u['openid']
				app.config.headPic = u['headimgurl']
				app.config.nickname = u['nickname']
				app.config.sex = sex
				app.config.country = u['country']
				app.config.pro = u['province']
				app.config.city['city']
				//TODO 立即将用户信息发送给服务器
			}
		});
		
	</script>
	<script src="privatejs/home.min.js"></script>
	<script type="text/javascript" defer src="utilities.min.js"></script>
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
	</div>
</body>
</html>