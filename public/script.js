const socket = io();
const userList = document.getElementById('user-list')
const chat = document.getElementById('chat')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('user-text')
const userUL = document.getElementById('users')

const userName = prompt("Enter User-Name: ")

/**Emit an event when user joins */
socket.emit('join', userName)

/**Listens for the userJoined event and runs a callback
 * -The callback in this case let's other users know that a new 
 * person has joined the chat
 */
socket.on('userJoined',(user)=>{
    addMessage(`${user} has joined the chat`)
})

/**Function to add messages */
function addMessage(input) {
    const messageElement = document.createElement('div');
    messageElement.textContent = input
    chat.appendChild(messageElement)

    chat.scrollTop = chat.scrollHeight
}

/**Handle Message form */
 messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const extractText = messageInput.value.trim()

    if (extractText) {
        socket.emit('chatMessage',{
            userName, text: extractText
        })
        messageInput.value = ""
    }
 })

 
 /**Listen for chatMessages */
 socket.on('chatMessage', (message)=>{
    addMessage(`${message.userName}: ${message.text}`)
 })

 /**Update List of users */
 socket.on('userList',(users)=>{
    userUL.innerHTML = users.map(e=>`<li>${e}</li>`).join("")
 })

 /**Listen for userLeft emit */
 socket.on('userLeft',(user)=>{
    addMessage(`${user} has left the chat`)
 })