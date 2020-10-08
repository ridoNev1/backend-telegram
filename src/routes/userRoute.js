const express = require('express');
const usersController = require('../controller/usersCont')

const router = express.Router();

router 
    // Register
    .post('/register', usersController.register)

    // Verify Token
    .get('/verify/:token', usersController.verify)

    // Login 
    .post('/login', usersController.Login)

    // RefreshToken
    .post('/refreshToken', usersController.renewToken)

    // Logout 
    .post('/logout/:iduser', usersController.Logout)

    // Forgot Password
    .post('/forgotpassword', usersController.forgotpassword)

    // Send New Password 
    .post('/newPassword/:userkey', usersController.newPassword)

    // Update
    .patch('/updatedata/:iduser', usersController.updateDetail)
    .get('/getdetail/:iduser', usersController.getDetail)
    .patch('/updateimage/:iduser', usersController.updateImage)
module.exports = router;