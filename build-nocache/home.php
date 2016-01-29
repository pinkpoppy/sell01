<?php
	//require_once('check.php');
	//require_once('auth.php');
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

			/*var u = '<?php echo $userInfo;?>';*/
			//if (u) {
			//	u = JSON.parse(u)
			//	var sex = u['sex']
			//	if (sex=='1') {
			//		sex = '男'
			//	} else if (sex=='2') {
			//		sex = '女'
			//	} else {
			//		sex = '其他'
			//	}
			//	localStorage.setItem('userId',u['openid'])
			//	localStorage.setItem('headPic',u['headimgurl'])
			//	localStorage.setItem('nickname',u['nickname'])
			//	localStorage.setItem('sex',sex)
			//	localStorage.setItem('country',u['country'])
			//	localStorage.setItem('pro',u['province'])
			//	localStorage.setItem('city',u['city'])

			//	app.config.userId = u['openid']
			//	app.config.headPic = u['headimgurl']
			//	app.config.nickname = u['nickname']
			//	app.config.sex = sex
			//	app.config.country = u['country']
			//	app.config.pro = u['province']
			//	app.config.city['city']
				//TODO 立即将用户信息发送给服务器
			//}
		});
		
	</script>
	<script src="privatejs/home.min.js"></script>
	<script type="text/javascript" defer src="utilities.min.js"></script>
</head>
<body>
	<div class="wrap">
		<section class="header">
		</section>
		<section class="notify"></section>
		<section class="home-special-sell-wrap">
		</section>
		<a id="detail-basket">
    	<span id="goods-num">0</span>
    </a>
	</div>
</body>
</html>