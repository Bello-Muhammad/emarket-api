const express = require('express')
const router = new express.Router()
const adminController = require('../controller/adminController')


router.get('/products', adminController.inventoryItem_get);
router.get('/additem', adminController.additemToInventory_get);
router.post('/additem', adminController.additemToInventory_post);
router.post('/removeproduct', adminController.productRemove_post);
router.get('/adminlogin', adminController.adminLogin_get);
router.post('/adminlogin', adminController.adminLogin_post);
router.get('/adminsignup', adminController.adminSignUp_get);
router.post('/adminsignup', adminController.adminSignUp_post);



module.exports = router