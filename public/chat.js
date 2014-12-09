window.onload = function() {

    console.log('loaded!');
 
    var messages = [];
    var color_codes = {}; // a dictionary of string -> color associations
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
            content.append(
                '<span class="username" style="color: ' + stringToHex(data.username) + '">'
                + data.username  + ': </span>'
                + data.message + '<br/>'
            );
            $("#content").scrollTop(content[0].scrollHeight);
        } else {
            console.log('error!: ', data);
        }
    });


    stringToHex = function(str) {
        return (str in color_codes) ? color_codes[str] : (color_codes[str] = '#'+ ('000000' + (Math.random()*0xFFFFFF<<0).toString(16)).slice(-6));
    }
 
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