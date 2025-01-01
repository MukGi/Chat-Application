/**Import requirements */
require('dotenv/config')
const express = require('express')
const app = express()
const http = require('http')
const socketIo = require('socket.io')
const PORT = process.env.PORT_NUM

/**Create the server */
const server = http.createServer(app)

/**initialize socketIo and attach it to the server */
const io = socketIo(server)
app.use(express.static('public'))

const users = new Set()

io.on("connection", (socket)=>{
    console.log("a user has connected")

    /**Handle Users that join chat */
    socket.on('join',(userName)=>{
        users.add(userName)

        /**Broadcast to all clients that user has joined */
        io.emit('userJoined', userName)

        /**Send updated User list to all clients */
        io.emit('userList',Array.from(users))
    })
    /**Handle incoming chat messages */

    /**Handle user disconnection */
})

/**Connect and listen on server */
server.listen(PORT,()=>{
    console.log(`Server running on: http://localhost:${PORT}`)
})