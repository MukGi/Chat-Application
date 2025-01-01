/**Import requirements */
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
    
    /**Handle incoming chat messages */

    /**Handle user disconnection */
})

/**Connect and listen on server */
app.listen(PORT,()=>{
    console.log(`Server running on: http://localhost/${PORT}`)
})