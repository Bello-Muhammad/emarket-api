const Inventory = require('../model/inventory')
const Admin = require('../model/admin')

const inventoryItem_get = async (req, res) => {
        
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

}

const additemToInventory_get = async (req, res) => {

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
    
}

const additemToInventory_post = async (req, res, next) => {
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
        
    } catch (e) {
        res.render('additem', {
            e
        })
        
    }
}

const productRemove_post = async (req, res) => {
    const admin = await Admin.findById({_id: req.session.user._id})
    
    if (admin.username === req.session.user.username) {
        const inventory = await Inventory.findById({_id: req.body.productId})
        inventory.remove()

    }
    res.redirect('/products')    
}

const adminLogin_get = (req, res) => {
    res.render('adminlogin')
}

const adminLogin_post = async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.username, req.body.password)
        if (!admin){
            res.redirect('/adminlogin',{
                e: e
            })
        }
        req.session.user = admin;
        res.redirect('/products')
    } catch (e) {
        res.render('adminlogin',{
            e: e
        })
    }  
}

const adminSignUp_get = (req, res) => {
    res.render('adminsignup')
}

const adminSignUp_post = async (req, res) => {
    try {
        const admin = new Admin(req.body)
        await admin.save(function(err, admin) {
            if (err) res.render('adminsignup')
        })
        res.redirect('/adminlogin')
    } catch (e) {
        res.redirect('/adminsignup')
    }
}

module.exports = {
    inventoryItem_get,
    additemToInventory_get,
    additemToInventory_post,
    productRemove_post,
    adminLogin_get,
    adminLogin_post,
    adminSignUp_get,
    adminSignUp_post
}