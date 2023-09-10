const express = require('express');
const router = new express.Router();
const { isAuth, authPage } = require('../middleware/auth')
const {
    getAdminSignUp,
    postAdminSignUp,
    getAdminLogin,
    postAdminLogin,
    adminHome,
    getAddProduct,
    postAddProduct,
    postRemoveProduct
} = require('../controller/adminController');

router.post('/admin/signup', postAdminSignUp)
router.get('/admin/signup', getAdminSignUp)
router.get('/admin/login',getAdminLogin)
router.post('/admin/login',postAdminLogin)
router.get('/admin/home',  isAuth, authPage(['admin']), adminHome)
router.get('/admin/additem', isAuth, authPage(['admin']), getAddProduct)
router.post('/admin/additem', isAuth, postAddProduct)
router.post('/admin/removeitem', isAuth, postRemoveProduct)


module.exports = router;