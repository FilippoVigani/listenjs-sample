import { listen } from "@filippovigani/listenjs"

window.onload = function() {

    // Get references to elements on the page.
    const form = document.getElementById('message-form');
    const messageField = document.getElementById('message');
    const messagesList = document.getElementById('messages');
    const socketStatus = document.getElementById('status');
    const closeBtn = document.getElementById('close');


    const listener = listen('wss://echo.websocket.org')

    // Handle any errors that occur.
    listener.onerror = function(error) {
        console.log('WebSocket Error: ' + error);
    };


    // Show a connected message when the WebSocket is opened.
    listener.onconnected = function() {
        socketStatus.innerHTML = 'Connected!';
        socketStatus.className = 'open';
    };


    // Handle messages sent by the server.
    listener.onupdate = function(payload) {
        messagesList.innerHTML += '<li class="received"><span>Received:</span>' + payload + '</li>';
    };

    // Show a disconnected message when the WebSocket is closed.
    listener.ondisconnected = function() {
        socketStatus.innerHTML = 'Disconnected from WebSocket.';
        socketStatus.className = 'closed';
    };


    // Send a message when the form is submitted.
    form.onsubmit = function(e) {
        e.preventDefault();

        // Retrieve the message from the textarea.
        const message = messageField.value;

        // Send the message through the WebSocket.
        listener.socket.send(message);

        // Add the message to the messages list.
        messagesList.innerHTML += '<li class="sent"><span>Sent:</span>' + message + '</li>';

        // Clear out the message field.
        messageField.value = '';

        return false;
    };


    // Close the WebSocket connection when the close button is clicked.
    closeBtn.onclick = function(e) {
        e.preventDefault();

        // Close the WebSocket.
        listener.dispose();

        return false;
    };

};
