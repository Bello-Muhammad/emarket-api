const express = require('express');
const router = new express.Router();
const {
    getSignUp,
    postSignUp,
    getLogin,
    postLogin,
} = require('../controller/userController');

router.post('/signup', postSignUp)
router.get('/signup', getSignUp)
router.get('/auth/login',getLogin)
router.post('/auth/login',postLogin)



module.exports = router;