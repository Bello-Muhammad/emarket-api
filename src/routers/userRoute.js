const express = require('express');
const router = new express.Router();
const {
    getSignUp,
    postSignUp,
    signup_login,
    getLogin,
    postLogin,
} = require('../controller/userController');

router.post('/signup', postSignUp)
router.get('/signup', getSignUp)
router.get('/auth/signup-login', signup_login)
router.get('/auth/login',getLogin)
router.post('/auth/login',postLogin)



module.exports = router;