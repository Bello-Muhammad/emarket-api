 const path = require('path')
const express = require('express')
const {Admin, Inventory, User, Cart} = require('./db/mongoose')
const session = require('express-session')
const hbs = require('hbs')
const bodyparser = require('body-parser')
const async = require('hbs/lib/async')
const { request } = require('http')
const { captureRejectionSymbol } = require('events')



const app = express()
const port = process.env.PORT

//defining path for express config
const distPath = path.join(__dirname,'../templates/dist')
const filesPath = path.join(__dirname, '../files')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

//setup handler engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

//setup static directory to serve
app.use(bodyparser.urlencoded({extended: false}))
app.use(express.static(filesPath))
app.use(express.static(distPath))

//setting up node to use session to authenticate user
app.use(session({
    secret: "thisisasecret",
    cookie: { maxAge: ''},
    resave: true,
    saveUninitialized: true,
  }))


//route for inventory items
app.get('/', async (req, res) => {
        
        const invent = await Inventory
        invent.find({}, function (e, item) {
            
            
            res.render('index', {inventory: {item}})
        }) 
})

app.get('/cart', async (req, res) => {
        if (req.session.user === undefined) {
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

app.post('/cart', async (req, res) => {

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
        }

        res.redirect('/cart')
        
})

app.post('/cartincrement', async (req, res) => {
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

app.post('/removeitem', async (req, res) => {
    const cart = await Cart.findById({_id: req.body.productId})
    console.log('item:')
    if (cart.userid === req.session.user._id) {
        cart.remove()
    }

    res.redirect('/cart')    
})

app.get('/checkout', async (req, res) => {

    if (req.session.user === undefined) {
        req.session.reset
       res.redirect ('/login')
    }

    const user = await User.findOne({_id: req.session.user._id}, function (e, doc) {

        res.render('checkout', {user: doc })
    }) 

})

app.post('/checkout', async (req, res) => {

    if (req.session.user === undefined) {
        req.session.reset
        res.redirect ('/login')
     }else{
         const user = await User.findByIdAndUpdate({_id: req.session.user._id}, {address: req.body.address})
         user.save()
     }

     res.redirect('/checkout')


})

app.get('/payment', async (req, res) => {

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

//routes for adding item
app.get('/additem', async (req, res) => {

    if (req.session.user === undefined) {
        req.session.reset
        res.redirect('/adminlogin')
    }else{
        const admin = await Admin.findOne({username: req.session.user.username})
        if(!admin){
            res.redirect('/adminlogin')
        }else{
            res.render('additem')
        }
    }
    
})



app.post('/additem',async (req, res, next) => {
        
    console.log(req.body)
    try {
        const invent = await Inventory.findByProduct(req.body.product)
        
        if (invent) {
            res.render('additem', {
                e: invent
            })
        }else{
            const inventory = new Inventory({
                product: req.body.product,
                price: req.body.price,
                quantity: req.body.quantity,
                filename: req.body.avatar
            })
            await inventory.save()
        }

        res.redirect('/additem')
        
        console.log(req.file)
        
    } catch (e) {
        res.render('additem', {
            e
        })
        
    }
    
    // res.redirect('/products')
})

app.get('/products', async (req, res) => {
        
        if (req.session.user === undefined) {
            req.session.reset
            res.redirect('/adminlogin')
        }else{
            const admin = await Admin.findOne({username: req.session.user.username})
            if (admin) {
                const invent = await Inventory
                console.log(admin.username)
                invent.find({}, function(e, item) {
                    res.render('products',{inventory: item})
                })
            }
        }   
    
})

app.post('/removeproduct', async (req, res) => {
    const admin = await Admin.findById({_id: req.session.user._id})
    
    if (admin.username === req.session.user.username) {
        const inventory = await Inventory.findById({_id: req.body.productId})
        inventory.remove()

    }

    res.redirect('/products')    
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save(function(err, user) {
            if (err) res.render('signup')
        })
        res.redirect('/login')
    } catch (e) {
        res.redirect('/signup')
    }
})

app.get('/adminlogin', async (req, res) => {
    res.render('adminlogin')
})

app.post('/adminlogin', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.username, req.body.password)
        if (!admin){
            res.redirect('/adminlogin',{
                e: e
            })
        }
        req.session.user = admin;
        // console.log(req.session.user)
        res.redirect('/products')
    } catch (e) {
        res.render('adminlogin',{
            e: e
        })

    }
    
})


app.get('/adminsignup', async (req, res) => {
    res.render('adminsignup')
})

app.post('/adminsignup', async (req, res) => {
    try {
        const admin = new Admin(req.body)
        await admin.save(function(err, admin) {
            if (err) res.render('adminsignup')
        })
        res.redirect('/adminlogin')
    } catch (e) {
        res.redirect('/adminsignup')
    }
})

app.get('/login', async (req, res) => {
    res.render('login')

})

app.post('/login', async (req, res) => {
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

app.get ('/about', (req, res) => {
    res.render('about')
})

app.get ('*', (req, res) => {
    res.render('404',{
        title: '404 page',
        errorMessage: 'page not found'
    })
})



app.listen(port, () => {
    console.log('server is up on port: '+port)
})