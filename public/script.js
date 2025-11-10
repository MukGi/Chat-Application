const socket = io();
const userList = document.getElementById('user-list')
const chat = document.getElementById('chat')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('user-text')
const userUL = document.getElementById('users')
const imageInput = document.getElementById('image-input')

const userName = prompt("Enter User-Name: ")

const profanities = ["fuck", "shit", "kys", "fucking","fucked", "bitch"]

/**Emit an event when user joins */
socket.emit('join', userName)

/**Listens for the userJoined event and runs a callback
 * -The callback in this case let's other users know that a new 
 * person has joined the chat
 */
socket.on('userJoined',(user)=>{
    notifyUser(`${user} has joined the chat`)
})

/**Function to add messages */
function addMessage(input) {
    const messageElement = document.createElement('div');
    messageElement.textContent = input
    chat.appendChild(messageElement)

    chat.scrollTop = chat.scrollHeight
}

/**Function to Notify */
function notifyUser(input) {
    const notification = document.createElement('div');
    notification.textContent = input
    notification.className = "notification"
    chat.appendChild(notification)

    chat.scrollTop = chat.scrollHeight
}

/**Upload images */
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = () => {
        socket.emit("upload", {
            userName: userName,
            image: reader.result,
            fileType: file.type
        })
    }
    reader.readAsArrayBuffer(file)
    imageInput.value = ''
})

/**Display images */
socket.on('imageMessage', (data) => {
    const messageElement = document.createElement('div')
    
    const userLabel = document.createElement('strong')
    userLabel.textContent = `${data.userName}: `
    messageElement.appendChild(userLabel)
    
    const img = document.createElement('img')
    const blob = new Blob([data.image], { type: data.fileType })
    img.src = URL.createObjectURL(blob)
    img.style.maxWidth = '300px'
    img.style.display = 'block'
    
    messageElement.appendChild(img)
    chat.appendChild(messageElement)
    chat.scrollTop = chat.scrollHeight
})

/**Handle Message Submission */
 messageForm.addEventListener('submit',async (e)=>{
    e.preventDefault()
    const extractText = messageInput.value.trim()
     
    //**Using local profanity check function*/
    // if (profanityCheck(extractText)) {
    //     alert("Can't say that")
    // }
    // else{
    // socket.emit('chatMessage',{ userName, text: extractText})
    //     messageInput.value = ""
    // }

    
    if (await profanityCheck(extractText)) {
        alert("Can't say that")
    } else {
        socket.emit('chatMessage',{ userName, text: extractText})
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

 /**Profanity filter */
function profanityCheck(message) {
let words = message.split(" ")
let found = false;
for (let i = 0; i < words.length && !found; i++) {
    for (let j = 0; j < profanities.length; j++) {
        if (words[i] == profanities[j]) {
                found = true
                break 
            }
        }
    }
return found
 }

 /**Profanity check with API */
 async function profanityCheck(message) {
    try {
    const res = await fetch('https://vector.profanity.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
    })

    const data = await res.json()
    return data.isProfanity || false  
    } catch (error) {
        console.error('Profanity check failed:', error)
        return false  
    }
    }