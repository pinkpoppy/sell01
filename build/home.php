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
	<script type="text/javascript" defer src="vendor.js"></script>
	<script type="text/javascript" src="app.js"></script>
	<script type="text/javascript">
		// function getSearchArgFromUrl(){
	 //    var searchString = window.location.search
	 //    var res = {}
	 //    if (searchString.length > 0) {
	 //      var argArr = searchString.substr(1,searchString.length -1 ).split('&')
	      
	 //      for (var i = 0; i < argArr.length; i++) {
	 //        var coupleArg = argArr[i].split('=')
	 //        console.log(coupleArg)

	 //        res[coupleArg[0]] = coupleArg[1]
	 //      }
	 //    }
	 //    return res
  // 	}

		$(document).ready(function()
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
	<script src="privatejs/home.js"></script>
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