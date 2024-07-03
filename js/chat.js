document.addEventListener('DOMContentLoaded', function () {
    // Base URL
    const baseUrl = 'http://localhost:3000/';

    /* Chat related code */
    const chatComponent = document.getElementById('chatComponent');
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const messageArea = document.getElementById('messageArea');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    var msgCount = 0;
    let username = '';
    let room = '';

    openChatBtn.addEventListener('click', function () {
        // Store to cookie? https://www.w3schools.com/js/js_cookies.asp
        if (!username) {
            username = prompt('Please enter your username:');
            if (!username) return;
        }
        if (!room) {
            room = prompt('Please enter the room name:');
            if (!room) return;
            socket.emit('join-room', { username, room });
        }
        chatComponent.style.display = 'block';
        // Hide openChatBtn after opening the chat
        openChatBtn.style.display = 'none';
    });

    closeChatBtn.addEventListener('click', function () {
        chatComponent.style.display = 'none';
        // Show openChatBtn after closing the chat
        openChatBtn.style.display = 'block';
        msgCount = 0;
    });

    // Send message
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message !== '') {
            socket.emit('chat-message', { username, room, message });
            messageInput.value = '';
        }
    }

    // Send message on button click
    sendMessageBtn.addEventListener('click', sendMessage);

    // Send message on Enter key press
    messageInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Output message to the chat component
    function outputMessage(message) {
        if (room !== message.room) return;
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `<p><strong>${message.username}: </strong>${message.message}</p>`;
        messageArea.appendChild(div);
        messageArea.scrollTop = messageArea.scrollHeight;
        if(message.username !== username){
            playNotificationSound();
            showNotification();
            msgCount++;
        }
    }

    // Play notification sound (https://www.w3schools.com/jsref/met_audio_play.asp)
    function playNotificationSound() {
        var audio = document.getElementById('notificationSound');
        audio.play();
    }

    // Show intermittent color change and exlamation mark on openChatBtn when a new notification is received
    // do that only if the chat is hidden (chatComponent.style.display === 'none') and until the user opens the chat
    // When the user opens the chat, the color change and exlamation mark should disappear and the openChatBtn should be back to the previous state
    function showNotification() {
        if (chatComponent.style.display === 'none') {
            let count = 0;
            const interval = setInterval(function () {
                openChatBtn.style.backgroundColor = count % 2 === 0 ? 'red' : '';
                openChatBtn.textContent = count % 2 === 0 ? '❕' : '✉️';
                openChatBtn.innerHTML += '<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">'+msgCount+'<span class="visually-hidden sr-only">unread messages</span></span>'
                count++;
            }, 500);
            setInterval(function () {
                if (chatComponent.style.display != 'none'){

                    clearInterval(interval);
                    openChatBtn.style.backgroundColor = '';
                    openChatBtn.textContent = '✉️';
                    msgCount = 0;
                }
            }, 200);
        }
    }
    
    
    


    // Connect to the server using socket.io
    const socket = io("http://localhost:3000", {
        path: "/socket-io/",
        transports: ['websocket', 'polling'], // Use polling as a fallback
        cors: {  // https://stackoverflow.com/a/64805972
            origin: "http://localhost:3000",
            credentials: true
        }
    });

    // Listen for chat-message event
    socket.on('chat-message', function (message) {
        outputMessage(message);
    });
});
