const express = require('express')
const router = new express.Router()
const martController = require('../controller/martController')


router.get('/', martController.mart_home);
router.get('/cart', martController.martCart_get);
router.post('/cart', martController.martCart_post);
router.post('/cartincrement', martController.cartQuantity_post);
router.post('/removeitem', martController.cartRemoveItem_post);
router.get('/checkout', martController.cartCheckout_get);
router.post('/checkout', martController.cartCheckout_post);
router.get('/payment', martController.martPayment_get);
router.get('/login', martController.martUserLogin_get);
router.post('/login', martController.martUserLogin_post);
router.get('/signup', martController.martUserSignup_get)
router.post('/signup', martController.martUserSignup_post)
router.get ('/about', martController.aboutMart)


module.exports = router