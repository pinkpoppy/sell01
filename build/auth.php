<?php
	
	$APPID = "wx9d7691ebcd3f48bc";
	$SECRET = "b4fe3e0a53db4affaf347d927563a4d7";
	$REDIRECT_URI = "http://t.snapwine.net:7784/auth.php";
	$SCOPE = "snsapi_userinfo";
	$STATE = "zhushasha";


	$code='';
	$autUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=".APPID."&redirect_uri=".urlencode(REDIRECT_URI)."&response_type=code&scope=".SCOPE."&state=".STATE."#wechat_redirect";

	$getTokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".APPID."&secret=".SECRET."&code=".$code."&grant_type=authorization_code";

	if (isset($_GET['code'])) {
	    $code=$_GET['code'];
	    $content=file_get_contents($getTokenUrl);
			$arr=json_decode($content,true);

			echo '<br/>token: '.$arr['access_token'];
			echo '<br/>openid: '.$arr['openid'];
			echo '<br/>';
	}
	else {
	   header("location:" . $autUrl);
	}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>新功能测试授权页面</title>
	<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=0.5 maximum-scale=-1.0,user-scalable=no">
	<script src="//cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
</head>
<body>
</body>
</html>