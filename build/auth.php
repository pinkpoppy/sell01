<?php
  
  $APPID = "wx9d7691ebcd3f48bc";
  $SECRET = "b4fe3e0a53db4affaf347d927563a4d7";
  //$TESTREDIRECT_URI = "http://127.0.0.1/~sszhu/gitwork/sell01/build/home.php";
  $REDIRECT_URI = "http://t.snapwine.net:7784/wxsell/home.php";
  $SCOPE = "snsapi_userinfo";
  $STATE = "zhushasha";


  $code='';
  //第一步要打开的页面
  $autUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=".$APPID."&redirect_uri=".urlencode($REDIRECT_URI)."&response_type=code&scope=".$SCOPE."&state=".$STATE."#wechat_redirect";
  $openId = "";
  $userInfo = "";
  if (isset($_GET['code'])) {
      $code=$_GET['code'];
      $getTokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$APPID."&secret=".$SECRET."&code=".$code."&grant_type=authorization_code";
      //在这里根据 code 获取到用户的 openID
      $content=file_get_contents($getTokenUrl);
      $arr=json_decode($content,true);
      // echo '<br/>token: '.$arr['access_token'];
      // echo '<br/>openid: '.$arr['openid'];
      // echo '<br/>';
      $accessToken = $arr['access_token'];
      $openId = $arr['openid'];
      if ($openId) {
        $getOtherInfoUrl = "https://api.weixin.qq.com/sns/userinfo?access_token=".$accessToken."&openid=".$openId."&lang=zh_CN";
        $userInfo = file_get_contents($getOtherInfoUrl);
      }

  }
  else {
     header("location:" . $autUrl);
  }
?>