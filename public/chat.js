window.onload = function() {

    console.log('loaded!');
 
    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var field = $('#text-box');
    var sendButton = $('input#send-button');
    var content = $('#chat-message-container');
    var name = $('#name');
 
    socket.on('message', function (data) { // bind a function, expect an object named data with a property 'message'
        if(data.message) {
            console.log('socket received message: ' + data.message)
            console.log('there are now ' + messages.length + ' messages')
            messages.push(data.message);
            content.append(data.username + ': ' + data.message + '<br/>');
            $("#content").scrollTop(content[0].scrollHeight);
        } else {
            console.log('error!: ', data);
        }
    });
 
    sendMessage = function() {
        var text = field.val();
        var username = name.val();
        if(username == "") {
            alert("Pick a username!");
            name.focus();
        } else {
            socket.emit('send', { message: text, username: username }); // fire a 'send' event to the socket
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