window.onload = function() {

    console.log('loaded!');
 
    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var field = $("#text-box.field");
    var sendButton = $('input#send-button');
    var content = $("#content");
 
    socket.on('message', function (data) { // bind a function, expect an object named data with a property 'message'
        if(data.message) {
            console.log('socket received message: ' + data.message)
            console.log('there are now ' + messages.length + ' messages')
            messages.push(data.message);
            content.append(data.message + '<br/>');
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.click(function() {
        var text = field.val();
        socket.emit('send', { message: text }); // fire a 'send' event to the socket
    });
 
}