var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");
var PORT = process.env.PORT || 3001;

app.use("/assets/", express.static(__dirname + "/assets"));

app.get('/', function(request, response){
  response.sendFile(__dirname + "/index.html");
});

chat = io.of('/chat');
var users = 0

  chat.on("connection", function(socket) {
    users++

    setTimeout(function(){chat.emit('users_online', users);
    console.log("aaa")}, 3000)

  socket.on('disconnect', function(){;
    users--
    chat.emit('users_online', users);
  });
  socket.on('track', function(track){
    var re1 = /archive\.org\//g
    var re2 = /creativecommons/
    if (re2.test(track.license == false)){track.license = 'please research this track before use.'}
    if (re1.test(track.url) == false)
    {return false}
    if (re1.test(track.imageurl) == false){
      track.imageurl == "placehold.it/400x300"
    }
    if (re1.test(track.releaseurl) == false){
      track.releaseurl = "https://archive.org/search?query=" + track.id
    }
    chat.emit('track', track);
  })
  socket.on('chat_message', function(message) {
    chat.emit('chat_message', message);
  });
});

http.listen(PORT, function(){
  console.log('listening on localhost:' + PORT);
});
