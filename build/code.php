<?php

$code='';
if (isset($_GET['code'])) {
    $code=$_GET['code'];
}
else {
    echo 'error';
    exit();
}

$content=file_get_contents('https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx9d7691ebcd3f48bc&secret=b4fe3e0a53db4affaf347d927563a4d7&code='.$code.'&grant_type=authorization_code');
echo $content.'<br/>';

$arr=json_decode($content,true);
echo '<br/>token: '.$arr['access_token'];
echo '<br/>openid: '.$arr['openid'];
echo '<br/>';
echo file_get_contents('https://api.weixin.qq.com/sns/userinfo?access_token='.$arr['access_token'].'&openid='.$arr['openid'].'&lang=zh_CN');
?>