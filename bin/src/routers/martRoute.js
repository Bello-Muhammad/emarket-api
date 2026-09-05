const express = require('express')
const router = new express.Router()
const { isAuth } = require('../middleware/auth')
const { getProducts, postCart, getCart, cartIncrement, removeCartItem, getCheckOut, postCheckOut, payment, about } = require('../controller/martController')

router.get('/', getProducts);
router.post('/cart', isAuth, postCart);
router.get('/cart', isAuth, getCart);
router.post('/cartincrement', isAuth, cartIncrement);
router.post('/removeitem', isAuth, removeCartItem);
router.get('/checkout', isAuth, getCheckOut);
router.post('/checkout', isAuth, postCheckOut);
router.get('/payment', isAuth, payment);
router.get('/about', about);

module.exports = router;