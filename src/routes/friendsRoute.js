const express = require('express')
const route = express.Router()
const friendsCont = require('../controller/friendCont')

route
  .post('/insert', friendsCont.insertFriend)
  .get('/find/:id', friendsCont.getFriends)
  .delete('/delete/:id', friendsCont.deleteFriend)

module.exports = route