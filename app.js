var express = require("express");
var port = 3700;
var app = express();
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public')); // we put front-end stuff in 'public' - tell express about it

var users = {}; // keep track of users
var userId = 0;  // each user is assigned an incrementing ID

app.get("/", function(req, res){
    res.render("chat-page");
}); 

// socket.io
var io = require('socket.io').listen(app.listen(port)); // pass express server to Socket.io
io.sockets.on('connection', function (socket) {
    // a socket is a junction b/w server and a client
    console.log('New socket formed: ' + socket.id)
  	users[socket.id] = firstUnusedClientKey(); // on connection, associate this id with a client #
    io.sockets.emit('message', {username: 'chat-bot', message: 'Welcome client #' + users[socket.id] + '!'}); // send a 'message' event to all sockets
    updateClientCounts(); // send a 'clientCountUpdate' event to all sockets

    socket.on('send', function (data) { // add an event listener to the 'send' function
        data.clientId = users[socket.id]; // send along the socket.id
        io.sockets.emit('message', data); // when we receive a 'send' on this socket, emit a 'message' event to all sockets
    });

    socket.on('disconnect', function(){
        io.sockets.emit('message', {username: 'chat-bot', message : 'Client #' + users[socket.id] + ' disconnected!'});
        delete users[socket.id];
    	updateClientCounts();
    });
});

console.log("Listening on port " + port);

firstUnusedClientKey = function() {
	key = 0;
	keys = Object.keys(users);
	if (keys) {
		while(key in keys) {
			key++;
		}
	}
	return key;
}

numClients = function() {
	return Object.keys(users).length;
}

updateClientCounts = function() {
	io.sockets.emit('clientCountUpdate', numClients());
}