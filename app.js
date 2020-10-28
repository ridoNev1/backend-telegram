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
const friendsRoute = require('./src/routes/friendsRoute')
const friendModel = require('./src/models/friend')
const { success } = require('./src/helpers/response')
const userModel = require('./src/models/users')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('src/uploads'))
app.use('/users', usersRouter)
app.use('/friends', friendsRoute)


io.on('connection', (socket) => {

  socket.on('set-status', (payload) => {
    const dataOnline = {
      statuson: 'Online'
    }
    userModel.updatedata(dataOnline, payload)

    socket.broadcast.emit('status-on', {
      message: `users ${payload} online`,
      onlineid: payload
    })
  })
  // disconnect 
  socket.on('on-dc', (payload) => {
    const dataOffline = {
      statuson: 'Offline'
    }
    userModel.updatedata(dataOffline, payload)
    socket.broadcast.emit('status', {
      message: `user ${payload} offline`,
      offlineid: payload
    })
  })

  socket.on('get-all-users', (payload) => {
    findAll().then(result => {
      io.emit('data-users', result)
    }).catch(err => {
      console.log(err)
    })
  })
  socket.on('get-friends', (payload) => {
    friendModel.getFriend(payload).then(result => {
      io.emit('list-friends', result)
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
      message: payload.textChat,
      type: payload.type
    }).then(() => {
      io.to(room).emit('private-message', {
        sender: payload.username,
        msg: payload.textChat,
        receiver: room,
        type: payload.type
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
  // notif
  socket.on('set-msgnotif', (payload) => {
    const sender = parseInt(payload.idsender)
    const receiver = payload.idreceiver
    const newChats = payload.newmessage
    friendModel.getNotif(receiver, sender).then(result => {
      const notif = {
        msg_notif: result[0].msg_notif + 1,
        newchats: newChats
      }

      friendModel.updateNotif(notif, receiver, sender).then(() => {
        io.to(receiver).emit('notif-response', {
          sender: sender,
          message: newChats
        })
      })
      // set new chats
      const newMsg = {
        newchats: newChats
      }
      friendModel.updateNotif(newMsg, sender, receiver)

    }).catch(err => {
      console.log(err)
    })
  })
  socket.on('join-room-notif', (payload) => {
    socket.join(payload)
  })
})


server.listen(PORT, () => {
  console.log(`running on port ${PORT}`)
})