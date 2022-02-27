const express = require('express')
const Inventory = require('../model/inventory')
const Cart = require('../model/cart')
const User = require('../model/user')
const router = new express.Router()


router.get('/', async (req, res) => {
        
    const invent = await Inventory
    invent.find({}, function (e, item) {
        
        
        res.render('index', {inventory: {item}})
    }) 
})

router.get('/cart', async (req, res) => {
    
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
    
})

router.post('/cart', async (req, res) => {

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

    
})

router.post('/cartincrement', async (req, res) => {
try {   
    const cart = await Cart.findOne({ _id: req.body.productId })
    console.log('Hy there   ')
    console.log(cart)
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
})

router.post('/removeitem', async (req, res) => {
const cart = await Cart.findById({_id: req.body.productId})
console.log('item:')
if (cart.userid === req.session.user._id) {
    cart.remove()
}

res.redirect('/cart')    
})

router.get('/checkout', async (req, res) => {

if (req.session.user === undefined) {
    req.session.reset
   res.redirect ('/login')
}

const user = await User.findOne({_id: req.session.user._id}, function (e, doc) {

    res.render('checkout', {user: doc })
}) 

})

router.post('/checkout', async (req, res) => {

if (req.session.user === undefined) {
    req.session.reset
    res.redirect ('/login')
 }else{
     const user = await User.findByIdAndUpdate({_id: req.session.user._id}, {address: req.body.address})
     user.save()
 }

 res.redirect('/checkout')


})

router.get('/payment', async (req, res) => {

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

})

router.get('/login', async (req, res) => {
    res.render('login')

})

router.post('/login', async (req, res) => {
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
})

router.get ('/about', (req, res) => {
res.render('about')
})

router.get ('*', (req, res) => {
res.render('404',{
    title: '404 page',
    errorMessage: 'page not found'
})
})

module.exports = router