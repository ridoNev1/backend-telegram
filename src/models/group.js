const db = require('../config/db')

module.exports = {
  getGroup: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM groupchats WHERE iduser=${id}`, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  insertGroup: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO groupchats SET ?`, data, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  } 
}