const usersModel = require('../models/users')
const { success, failed, tokenStatus } = require('../helpers/response')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('nodemailer')
const { JWT_KEY, emaill, passwordd, url, urlforgot } = require('../helpers/env')

const users = {
  register: async (req, res) => {
    try {
      const body = req.body
      console.log(body)
      const salt = await bcrypt.genSalt(10)
      const hashWord = await bcrypt.hash(body.password, salt)

      const usernamefromfullname = body.fullname.replace(/[^0-9a-z]/gi, '')

      const data = {
        fullname: body.fullname,
        username: usernamefromfullname,
        email: body.email,
        password: hashWord,
        active: 0,
        image: '404.png'
      }

      usersModel.register(data)

        .then(() => {
          const hashWord = jwt.sign({
            email: data.email,
            username: data.username
          }, JWT_KEY)

          let transporter = mailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
              user: emaill,
              pass: passwordd
            }
          })

          let mailOptions = {
            from: `Telegram <noreply@gmail.com>`,
            to: data.email,
            subject: `Hello ${data.email}`,
            html:
              `Hai <h1><b>${data.fullname}</b></h1> <br>
                    PLEASE ACTIVE YOUR EMAIL ! <br>
                    and you can Login with your Email <br>
                    <b><a href="${url}users/verify/${hashWord}">ACTIVATION</a></b>`
          }

          transporter.sendMail(mailOptions, (err, result) => {
            if (err) {
              res.status(505)
              failed(res, [], err.message)
            } else {
              success(res, [result], `Send Email Success`)
            }
          })

          res.json({
            message: `Success Registration, Please activate your Email`
          })

        }).catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], `Internal Server Error!`)
    }
  },
  verify: (req, res) => {
    const token = req.params.token
    if (token) {
      jwt.verify(token, JWT_KEY, (err, decode) => {
        if (err) {
          res.status(500)
          failed(res, [], `Failed Activation`)
        } else {
          const email = decode.email
          usersModel.getUsers(email)
            .then((result) => {
              if (result.affectedRows) {
                res.status(200)
                res.render('index', { email })
              } else {
                res.status(505)
                failed(res, [], err.message)
              }
            })
            .catch((err) => {
              res.status(505)
              failed(res, [], err.message)
            })
        }
      })
    }
  },
  Login: async (req, res) => {
    try {
      const body = req.body

      usersModel.Login(body)

        .then(async (result) => {
          const userData = result[0]
          const hashWord = userData.password
          const userRefreshToken = userData.refreshToken
          const correct = await bcrypt.compare(body.password, hashWord)

          if (correct) {
            if (userData.active === 1) {
              jwt.sign(
                {
                  email: userData.email,
                  username: userData.username
                },
                JWT_KEY,
                { expiresIn: 120 },

                (err, token) => {
                  if (err) {
                    console.log(err)
                  } else {
                    if (userRefreshToken === null) {
                      const id = userData.iduser
                      const refreshToken = jwt.sign(
                        { id }, JWT_KEY
                      )
                      usersModel.updateRefreshToken(refreshToken, id)
                        .then(() => {
                          const data = {
                            iduser: userData.iduser,
                            username: userData.username,
                            token: token,
                            refreshToken: refreshToken
                          }
                          tokenStatus(res, data, 'Login Success')
                        }).catch((err) => {
                          failed(res, [], err.message)
                        })
                    } else {
                      const data = {
                        iduser: userData.iduser,
                        username: userData.username,
                        fullname: userData.fullname,
                        image: userData.image,
                        token: token,
                        refreshToken: userRefreshToken
                      }
                      tokenStatus(res, data, 'Login Success')
                    }
                  }
                }
              )
            } else {
              failed(res, [], 'Need Activation')
            }
          } else {
            failed(res, [], 'Incorrect password! Please try again')
          }
        })
        .catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], `Internal Server Error!`)
    }
  },
  renewToken: (req, res) => {
    try {
      const refreshToken = req.body.refreshToken

      usersModel.checkRefreshToken(refreshToken)
        .then((result) => {
          if (result.length >= 1) {
            const user = result[0];
            const newToken = jwt.sign(
              {
                email: user.email,
                username: user.username,
                level: user.level
              },
              JWT_KEY,
              { expiresIn: 3600 }
            )
            const data = {
              token: newToken,
              refreshToken: refreshToken
            }
            tokenStatus(res, data, `The token has been refreshed successfully`)
          } else {
            failed(res, [], `Refresh token not found`)
          }
        }).catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], `Internal Server Error!`)
    }
  },
  Logout: (req, res) => {
    try {
      const destroy = req.params.iduser
      usersModel.Logout(destroy)
        .then((result) => {
          success(res, result, `Logout Success`)
        }).catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], `Internal Server Error!`)
    }
  },
  forgotpassword: (req, res) => {
    try {
      const body = req.body
      const email = body.email
      usersModel.getEmailUsers(email)

        .then(() => {
          const userKey = jwt.sign({
            email: body.email
          }, JWT_KEY)

          usersModel.updateUserKey(userKey, email)
            .then(async () => {
              let transporter = mailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                  user: emaill,
                  pass: passwordd
                }
              })

              let mailOptions = {
                from: `Telegram <noreply@gmail.com>`,
                to: body.email,
                subject: `Reset Password ${body.email}`,
                html:
                  `Hai, This is an email to reset the password <br>
                        KLIK --> <a href="${urlforgot}/new-password?userkey=${userKey}"> Klik this link for Reset Password </a> <--`
              }

              transporter.sendMail(mailOptions, (err, result) => {
                if (err) {
                  res.status(505)
                  failed(res, [], err.message)
                } else {
                  success(res, [result], `Send Mail Success`)
                }
              })
              res.json({
                message: `Please Check Email For Reset Password`
              })
            }).catch((err) => {
              failed(res, [], err)
            })
        })
    } catch (error) {
      failed(res, [], error.message)
    }
  },
  newPassword: async (req, res) => {
    try {
      const body = req.body

      const salt = await bcrypt.genSalt(10)
      const hashWord = await bcrypt.hash(body.password, salt)

      const key = req.params.userkey

      usersModel.newPassword(hashWord, key)
        .then((result) => {
          success(res, result, `Update Password Success`)
          jwt.verify(key, JWT_KEY, (err, decode) => {
            if (err) {
              res.status(505)
              failed(res, [], `Failed Reset UserKey`)
            } else {
              const email = decode.email
              usersModel.resetKey(email)
                .then((results) => {
                  if (results.affectedRows) {
                    res.status(200)
                    success(res, results, `Update Password Success`)
                  } else {
                    res.status(505)
                    // failed(res, [], err.message)
                  }
                }).catch((err) => {
                  // failed(res, [], err)
                })
            }
          })
        }).catch((err) => {
          failed(res, [], err)
        })

    } catch (error) {
      failed(res, [], `Internal Server Error`)
    }
  }

}

module.exports = users
