var express = require("express");
var port = 3700;
var app = express();

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public')); // we put front-end stuff in 'public' - tell express about it

app.get("/", function(req, res){
    res.render("chat-page");
}); 

// socket.io
var io = require('socket.io').listen(app.listen(port)); // pass express server to Socket.io
io.sockets.on('connection', function (socket) {
    // socket is a junction b/w server and client
    socket.emit('message', { message: 'Welcome!', username: 'chat-bot' }); // send an initial 'message' event to the socket
    socket.on('send', function (data) { // add an event listener to the 'send' function
        io.sockets.emit('message', data);
    });
});

console.log("Listening on port " + port);