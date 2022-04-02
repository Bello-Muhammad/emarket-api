const Inventory = require('../model/inventory')
const Cart = require('../model/cart')
const User = require('../model/user')

const mart_home = async (req, res) => {
        
    const invent = await Inventory
    invent.find({}, function (e, item) {
        
        
        res.render('index', {inventory: {item}})
    }) 
}

const martCart_get = async (req, res) => {
    
    if ( req.session.user === undefined) {
        req.session.reset
        res.redirect('/login')
    }else{
        const cart = await Cart
        cart.find({userid: req.session.user._id}, function (e, item) {
        const products = item.map(p => {
            const product = p
            product.price = p.price * p.quantity
            return product
        })

        let price = 0
        products.forEach(p => {
            price += p.price
        })
        res.render('cart', { carts: { products, price} })
        })
    }
    
}

const martCart_post = async (req, res) => {

    const inventory = await Inventory.findOne({ _id: req.body._id })
    const carts = await Cart.findByProduct(inventory.product)
    if(req.session.user === undefined){
        req.session.reset
        res.redirect('/login')
    }else if(carts && (req.session.user !== undefined)) {
        res.redirect('/cart')
        
    }else{
        const cart = new Cart({
            product: inventory.product,
            price: inventory.price,
            filename: inventory.filename,
            userid: req.session.user._id
        }).save()
        res.redirect('/cart')
    }
}

const cartQuantity_post = async (req, res) => {
    try {   
        const cart = await Cart.findOne({ _id: req.body.productId })
        
        if (req.body.action === 'increment') {
            cart.quantity += 1
            await cart.save()

        } else {
            if (cart.quantity > 1) {
                cart.quantity -= 1
                await cart.save()
            } else {
                const cart = await Cart.findOneAndDelete({_id: req.body.productId})   
            }
        }
    
        res.redirect('/cart')
    
    } catch (error) {
        console.log(error)
    }
}

const cartRemoveItem_post = async (req, res) => {
    const cart = await Cart.findById({_id: req.body.productId})
    if (cart.userid === req.session.user._id) {
        cart.remove()
    }else if (cart.userid === null){
        res.redirect('/cart')
    }

    res.redirect('/cart')    
}

const cartCheckout_get = async (req, res) => {

    if (req.session.user === undefined) {
        req.session.reset
       res.redirect ('/login')
    }
    
    const user = await User
    user.findOne({_id: req.session.user._id}, function (e, doc) {
        res.render('checkout', {user: doc })
    }) 
    
}

const cartCheckout_post = async (req, res) => {
    const user = await User.findByIdAndUpdate({_id: req.session.user._id}, {address: req.body.address})
    user.save()
    
    res.redirect('/checkout')
}

const martPayment_get = async (req, res) => {

    if (req.session.user === undefined) {
        res.redirect('/login')
    }
    
    
    const cart = await Cart
    cart.find({userid: req.session.user._id}, function (e, item) {
        const products = item.map(p => {
            const product = p
            product.price = p.price * p.quantity
            return product
        })
    
        let price = 0
        products.forEach(p => {
            price += p.price
        })
    
        res.render('payment', { carts: { products, price} })
    })
    
}

const martUserLogin_get = (req, res) => {
    res.render('login')
}

const martUserLogin_post = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if (!user){
            res.redirect('/login',{
                e: e
            })
        }
        req.session.user = user;
        res.redirect('/')
    } catch (e) {
        res.render('login',{
            e: e
        })
    }
}

const martUserSignup_get = (req, res) => {
    res.render('signup')
}

const martUserSignup_post = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save(function(err, user) {
            if (err) res.render('signup')
        })
        res.redirect('/login')
    } catch (e) {
        res.redirect('/signup')
    }
}

const aboutMart = (req, res) => {
    res.render('about')
}


module.exports = {
    mart_home,
    martCart_get,
    martCart_post,
    cartQuantity_post,
    cartRemoveItem_post,
    cartCheckout_get,
    cartCheckout_post,
    martPayment_get,
    martUserLogin_get,
    martUserLogin_post,
    martUserSignup_get,
    martUserSignup_post,
    aboutMart
}