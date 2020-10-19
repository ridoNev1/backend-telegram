const db = require('../config/db')
const fs = require('fs')

const users = {
  register: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO users SET ?`, data, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  getUsers: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET active = 1 WHERE email = '${data}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  Login: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE email = '${data.email}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  updateRefreshToken: (token, id) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET refreshToken='${token}' WHERE iduser='${id}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  checkRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT *FROM users WHERE refreshToken= '${refreshToken}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  Logout: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET refreshToken = null WHERE iduser='${id}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  getEmailUsers: (email) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT *FROM users WHERE email='${email}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            if (result.length > 0) {
              resolve(result)
            } else {
              reject(`Email tidak ditemukan`)
            }
          }
        })
    })
  },
  updateUserKey: (userKey, email) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET userkey='${userKey}' WHERE email='${email}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  newPassword: (password, userkey) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET password='${password}' WHERE userkey='${userkey}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  resetKey: (email) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET userkey = null WHERE email='${email}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  updatedata: (data, id) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET ? WHERE iduser = ?`, [data, id], (err, res) => {
        if(err) {
            reject(new Error(err));
        }else {
            resolve(res);
        }
      })
    })
  },
  getDetail: (iduser) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * from users WHERE iduser = ${iduser}`, (err, result) => {
        if(err) {
          reject(new Error(err));
        }else {
            resolve(result);
        }
      })
    })
  },
  updateImage:(data, iduser) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET ? WHERE iduser = ?`, [data, iduser], (err, res) => {
        if(err) {
          reject(new Error(err))
        }else {
          resolve(res)
        }
      })
    })
  }
}

module.exports = users