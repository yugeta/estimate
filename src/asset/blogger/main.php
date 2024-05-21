<?php

/**
 * javascriptからの問い合わせ用エンドポイント
 */

switch(@$_POST["mode"]){
  case "blogger":
    require_once "blogger.php";
    $inst = new Blogger($_POST);
    $res = [
      "status"  => $inst->datas ? "success" : "error",
      "datas"   => $inst->datas,
      "options" => $inst->options,
    ];
    echo json_encode($res , JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
  break;
}
