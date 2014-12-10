window.onload = function() {

    console.log('loaded!');
 
    var color_codes = {}; // a dictionary of string -> color associations
    var socket = io.connect('http://localhost:3700');
    var messages = [];
    var field = $('#text-box');
    var sendButton = $('input#send-button');
    var content = $('#chat-message-container');
    var name = $('#name');
    var count = $('#client-count');

    // get last 5 messages
 
    socket.on('message', function (data) { // when the socket receives a 'message' function, expect an object named data
        if(data.message) {
            console.log('socket received message: ' + data.message)
            console.log('there are now ' + messages.length + ' messages')
            messages.push(data.message);
            content.append(
                '<div class="message row">'
                + '<div class="col-md-8 content">'
                    + '<span class="username" style="color: ' + stringToHex(data.username) + '">'
                    + data.username 
                    + ': </span>'
                    + data.message 
                + '</div>'
                + '<div class=col-md-4>'
                    + '<span class="timestamp">' 
                    + (data.username=='chat-bot' ? 'chat-bot' : ('client #' + data.clientId)) // only add a client id if it wasn't from chatbot
                    + ' ' + currentTimeString()
                + '</div>'
                + '</div>'
            );
            content.scrollTop(content[0].scrollHeight);
        } else {
            console.log('error!: ', data);
        }
    });

    socket.on('clientCountUpdate', function(num) {
        if (num > 1){
            count.text(num + ' users here');
        } else {
            count.text("you're the only one here :(");
        }
        
    });


    stringToHex = function(str) {
        return (str in color_codes) ? color_codes[str] : (color_codes[str] = randomHex());
    }

    randomHex = function() {
        return '#'+ (Math.random()*0xFFFFFF<<0).toString(16).slice(-6);
    }

    currentTimeString = function() {
        var dt = new Date();
        return '@ ' + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    }
 
    sendMessage = function() {
        var text = field.val();
        var username = name.val();
        if(username == "") {
            alert("Pick a username!");
            name.focus();
        } else {
            socket.emit('send', { message: text, username: username }); // fire a 'send' event back to the socket
            field.val('');
        }
    };

    sendButton.click(function() {
        console.log('clicked!')
        sendMessage();
    });

    field.keyup(function(e) {
        if(e.keyCode == 13) {
            sendMessage();
        }
    });
}