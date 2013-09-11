//DOMの取得
//querySelectorはマッチする要素のうち最初の要素を返す
var form = document.querySelector("form") 
  , input = document.querySelector("input[name=message]")
  , result = document.querySelector(".result");

//websocketサーバーへ接続準備
var ws = new WebSocket("ws://localhost:3000"); //"ws://"+location.hostでもOK

//websocketサーバーとの接続完了した場合の処理-open-

ws.addEventListener("open" , function(e){
  result.innerHTML += "「サーバーと接続しました」<br>";
},false);


//websocketサーバーからメッセージを受信-message-
ws.addEventListener("message" , function(e){
  result.innerHTML += "「" + e.data + "」<br>";
},false);


//websocketとの接続切断-close-
ws.addEventListener("close" ,  function(e){
   result.innerHTML += "「接続が切れました」<br>";
},false);


//ユーザーがメッセージを入力した時の処理-submit-
form.addEventListener("submit", function(e){
  //フォームのデフォルト動作を制御する
  e.preventDefault();
  var msg = input.value;

  if(ws){
    ws.send(msg);
    //送信したら前の入力フォームを空にする
    input.value = "";
  }
},false);

