const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const socketio = require('socket.io')
const server = require('http').createServer(app)
const io = socketio(server)
const ejs = require('ejs')
const path = require('path')
const usersRouter = require('./src/routes/userRoute')
const { PORT } = require('./src/helpers/env')
app.use(cors())
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')
const { findAll } = require('./src/models/users')
const { insertChat, getChat } = require('./src/models/chats')



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('src/uploads'))
app.use('/users', usersRouter)


io.on('connection', (socket) => {
  console.log('connect')
  socket.on('get-all-users', (payload) => {
    findAll().then(result => {
      io.emit('data-users', result)
    }).catch(err => {
      console.log(err)
    })
  })
  socket.on('join-room', (payload) => {
    socket.join(payload)
  })
  socket.on('send-message', (payload) => {
    const room = payload.room
    insertChat({
      sender: payload.username,
      receiver: room,
      message: payload.textChat
    }).then(() => {
      io.to(room).emit('private-message', {
        sender: payload.username,
        msg: payload.textChat,
        receiver: room
      })
    }).catch(err => {
      console.log(err)
    })
  })
  socket.on('get-history-message', (payload) => {
    getChat(payload).then(result => {
      io.to(payload.sender).emit('history-message', result)
    }).catch(err => {
      console.log(err)
    })
  })
})

server.listen(PORT, () => {
  console.log(`running on port ${PORT}`)
})