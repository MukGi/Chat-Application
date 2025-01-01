const socket = io();
const userList = document.getElementById('user-list')
const chat = document.getElementById('chat')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('user-text')

const userName = prompt("Enter User-Name: ")

socket.emit('join', userName)

socket.on('userJoined',(user)=>{
    addMessage(`${user} has joined the chat`)
})

function addMessage(input) {
    const messageElement = document.createElement('div');
    messageElement.textContent = input
    chat.appendChild(messageElement)

    chat.scrollTop = chat.scrollHeight
}

