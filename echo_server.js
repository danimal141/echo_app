/**
  * Module dependencies.
*/
//各モジュールの参照
var express = require("express"), //express
    routes = require("./routes"), //routesのindex.js
    http = require("http"),
    path = require("path"),
    WebSocketServer = require("ws").Server;

//サーバの機能を参照するインスタンスを各変数にセット
var app = express(),
    httpServer = http.createServer(app)
    wss = new WebSocketServer({server:httpServer});

//configureで環境に適したミドルウェアを割り当てる
app.configure(function() {
  app.set("port", process.env.PORT || 3000);
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.use(express.favicon());
  app.use(express.logger("dev"));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, "public")));
});

app.configure("development", function() {
  app.use(express.errorHandler());
});

app.get("/", routes.index);

//websocketがクライアントに接続するとサーバーインスタンスwssにconnectionイベントが発生する
wss.on("connection", function(ws) {
  console.log("established websocket connection");
  //クライアントからデータを受信するとクライアントインスタンスwsにmessageイベントが発生する
  ws.on("message", function(data, flag) {
    ws.send(data, {binary: flag.binary});
  });
});

//httpServer, websocketServerを起動する
httpServer.listen(app.get("port"), function() {
  console.log("Express server listening on port" + app.get("port"));
});
