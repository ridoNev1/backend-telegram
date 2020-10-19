const friendModel = require('../models/friend')
const { failed, success } = require('../helpers/response')

module.exports = {
  insertFriend: (req, res) => {
    const body = req.body
    const data = {
      id_users: body.id_users,
      id_friends: body.id_friends
    }
    friendModel.insertFriend(data)
      .then(result => {
        success(res, result, 'Success add friend')
      }).catch(err => {
        failed(res, [], err.message)
      })
    friendModel.insertFriend({
      id_users: body.id_friends,
      id_friends: body.id_users
    })
  },
  getFriends: (req, res) => {
    const id = req.params.id
    friendModel.getFriend(id)
      .then(result => {
        success(res, result, 'Get users friends')
      }).catch(err => {
        failed(res, [], err.message)
      })
  },
  deleteFriend: (req, res) => {
    const id = req.params.id
    friendModel.deleteFriend(id)
      .then(result => {
        success(res, result, 'Delete friend success')
      }).catch(err => {
        failed(res, [], err.message)
      })
  },
  updateNewNotif: (req, res) => {
    const body = req.body
    const iduser = body.id_users
    const idfriend = body.id_friends
    const data = {
      msg_notif: 0 
    }
    friendModel.updateNotif(data, iduser, idfriend)
      .then(response => {
        success(res, response, 'set new message done !')
      }).catch(err => {
        failed(res, [], err.message)
      })
  }
}