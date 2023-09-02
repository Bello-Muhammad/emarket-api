const {
    products,
    post_Cart,
    get_Cart,
    cart_Increment,
    remove_CartItem,
    get_CheckOut,
    post_CheckOut,
    Payment
 } = require('../services/martService')
const async = require('hbs/lib/async')


const getProducts = async (req, res) => {
    try {  
        const data = await products();

        res.status(200).render('index', {
            inventory: data
        })
    } catch (err) {
        res.status(400).redirect('/')
    }
}

const postCart = async (req, res) => {
    try {
        const userid = req.session.user._id
        const body = req.body

        await post_Cart(userid, body);
        res.status(200).redirect('/')

    } catch (err) {
        res.status(400).redirect('/cart')
    }
}

const getCart = async (req, res) => {
    try {
        
        const userid = req.session.user._id
        const data = await get_Cart(userid);

        res.status(200).render('cart', { carts: data })
        
    } catch (err) {

        res.status(400).redirect('/cart')
    }
}

const cartIncrement = async (req, res) => {

    try {
        const body = req.body;

        await cart_Increment(body);
        res.status(200).redirect('/cart')
    } catch (err) {
        res.status(400).redirect('/cart')
    }
}

const removeCartItem = async (req, res) => {
    try {
        const body = req.body;

        const data = await remove_CartItem(body);
        res.status(200).redirect('/cart')
    } catch (err) {
        res.status(400).redirect('/cart')
    }
}

const getCheckOut = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const data = await get_CheckOut(userId);
    
        res.status(200).render('checkout', { user: data });
    } catch (err) {
        res.status(400).redirect('/checkout')
    }
}

const postCheckOut = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const body = req.body;
        const data = await post_CheckOut(userId, body);

        res.status(200).redirect('/checkout')
    } catch (err) {
        res.status(400).redirect('/checkout')
    }
}

const payment = async (req, res) => {
    try {
        const userid = req.session.user._id;
        const data = await Payment(userid);

        res.status(200).render('payment', { carts: data })        
    } catch (err) {
        console.log(err.message)
    }
}

const about = (req, res) => {
    res.render('about')
}


module.exports = {
    getProducts,
    postCart,
    getCart,
    cartIncrement,
    removeCartItem,
    getCheckOut,
    postCheckOut,
    payment,
    about
}