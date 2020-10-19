const db = require('../config/db')

module.exports = {
  insertFriend: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO friends SET ?`, data, (err, res) => {
        if(err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  getFriend: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * from friends LEFT JOIN users ON friends.id_friends=users.iduser WHERE id_users = ?`, id, (err, result) => {
        if(err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  deleteFriend: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM friends WHERE id_users = ?`, id, (err, res) => {
        if(err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  updateNotif: (data, iduser, idfriends) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE friends SET ? WHERE id_users = ? AND id_friends = ?`, [data, iduser, idfriends], (err, res) => {
        if(err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  getNotif: (iduser, idfriends) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM friends WHERE id_users = ? AND id_friends = ?`, [iduser, idfriends], (err, res) => {
        if(err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  }
}