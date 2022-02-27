const express = require('express')
const Inventory = require('../model/inventory')
const Admin = require('../model/admin')
const router = new express.Router()



router.get('/additem', async (req, res) => {

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

router.post('/additem',async (req, res, next) => {
        
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

router.get('/products', async (req, res) => {
        
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

router.post('/removeproduct', async (req, res) => {
    const admin = await Admin.findById({_id: req.session.user._id})
    
    if (admin.username === req.session.user.username) {
        const inventory = await Inventory.findById({_id: req.body.productId})
        inventory.remove()

    }

    res.redirect('/products')    
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
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

router.get('/adminlogin', async (req, res) => {
    res.render('adminlogin')
})

router.post('/adminlogin', async (req, res) => {
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


router.get('/adminsignup', async (req, res) => {
    res.render('adminsignup')
})

router.post('/adminsignup', async (req, res) => {
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



module.exports = router