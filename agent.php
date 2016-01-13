<?php
  $directUrl = "https://t.snapwine.net:7748/wxsell/rec.html";
  //$testdirectUrl = "rec.php";
  if (strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger')==false) {
    header('location:'.$directUrl);
  }
?>