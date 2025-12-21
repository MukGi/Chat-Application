/**Import requirements */
require('dotenv/config')
const express = require('express')
const app = express()
const http = require('http')
const socketIo = require('socket.io')
const PORT = process.env.PORT_NUM
const fs = require('fs');

const path = require('path')

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir)
}

app.use('/uploads', express.static('uploads'))

/**Create the server */
const server = http.createServer(app)

/**initialize socketIo and attach it to the server */
const io = socketIo(server)
app.use(express.static('public'))

const users = new Set()

io.on("connection", (socket)=>{
    console.log("a user has connected")
    /**Listen and Handle User join event */
    socket.on('join',(userName)=>{
        socket.userName = userName
        /**update members list */
        users.add(userName) 

        /**Broadcast to all clients that a user has joined */
        io.emit('userJoined', userName)

        /**Send updated User list to all clients */
        io.emit('userList',Array.from(users))
    })
    
    /**Handle incoming chat messages */
    socket.on('chatMessage',(message)=>{
        io.emit('chatMessage', message)
    })

    /**Handle image upload signals */
      socket.on("upload", (data)=>{
        io.emit('imageMessage', {
            userName: data.userName,
            image: data.image,
            fileType: data.fileType
        })
    })
    /**Handle user disconnection */
    socket.on('disconnect',()=>{
        console.log(`${socket.userName} has disconnected`)
        users.forEach(user=>{
            if (user===socket.userName) {
                users.delete(user)
                io.emit('userLeft', user)

                io.emit('userList', Array.from(users))
            }
        })
    })
})

/**Connect and listen on server */
server.listen(PORT,()=>{
    console.log(`Server running on: http://localhost:${PORT}`)
})