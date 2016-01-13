<?php
  require_once('switch.php');
  if ($isRestrictOpenInWeiXin) {
    $directUrl = "http://t.snapwine.net:7784/wxsell/rec.php";
    //$testdirectUrl = "rec.php";
    if (strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger')==false) {
      header('location:'.$directUrl);
    }
  }
?>