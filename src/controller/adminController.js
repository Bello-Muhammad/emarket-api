const { post_AdminSignUp, signup_Login, post_AdminLogin } = require('../services/adminService');
const { products, post_AddProduct, removeProduct } = require('../services/martService')


const getAdminSignUp = (req, res) => {
    let { e } = req.query;
    if(e) {
        res.render('adminsignup', {
            e
        })
    }else{
        res.render('adminsignup')
    }
}

const postAdminSignUp = async (req, res) => {
    try {
        const body = req.body;
        const data = await post_AdminSignUp(body);
        res.status(200).redirect('/admin/signup-login?username='+data.username)
    } catch (err) {
        let e = err.message;
        res.status(400).redirect('/admin/signup?exist='+e);
    }
}

const signup_login = async (req, res) => {

    try {
        const body = req.query;

        const user = await signup_Login(body);
        req.session.user = user;
        res.redirect('/admin/home')
    } catch (err) {
        console.log(err)
    }
}

const getAdminLogin = (req, res) => {
    let { e } = req.query;
    if(e) {
        res.render('adminlogin', {
            e
        })
    }else{
        res.render('adminlogin')
    }
}

const postAdminLogin = async (req, res) => {
    try {
        const body = req.body;
        const user = await post_AdminLogin(body);

        req.session.user = user;
        res.redirect('/admin/home')
    } catch (err) {
        const e = err.message
        res.redirect('/admin/login?e='+e)
    }
}

const adminHome = async (req, res) => {
    try {
        const data = await products();

        res.status(200).render('products', { inventory: data});
    } catch (err) {
        res.status(400).redirect('/admin/home');
    }
}

const getAddProduct = (req, res) => {
    let { e } = req.query
    if(e) {
        res.render('additem', {
            e
        })
    }

    res.render('additem')
}

const postAddProduct = async (req, res) => {
    try {
        const body = req.body;
        await post_AddProduct(body)

        res.redirect('/admin/additem')

    } catch (err) {
        let e = err.message;
        res.redirect('/admin/additem?e='+e)
    }
}

const postRemoveProduct = async (req, res) => {
    try {
        const body = req.body

        await removeProduct(body)
        res.status(200).redirect('/admin/home')
    } catch (err) {
        res.status(400).redirect('/admin/home');
    }
}

module.exports = {
    getAdminSignUp,
    postAdminSignUp,
    signup_login,
    getAdminLogin,
    postAdminLogin,
    adminHome,
    getAddProduct,
    postAddProduct,
    postRemoveProduct
}