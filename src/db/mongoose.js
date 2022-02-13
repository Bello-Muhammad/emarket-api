const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const async = require('hbs/lib/async')
const { default: validator } = require('validator')


// process.env.MONGODB_URL
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true
})

//Inventory model
const inventorySchema = new mongoose.Schema({
    product: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
        default: 1
    },
    filename: {
        type: String
    }
})

//inventorySchema
inventorySchema.statics.findByProduct = async ( product ) => {
    const inventory = await Inventory.findOne({ product })
    if(inventory) {
       throw new Error ('item exist')
    }

}

//User model
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('"password" can not be used')
            }
        }
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: Number,
        minlength: 11
    }
})


//userSchema
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user) {
        throw new Error ("invalid email")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error ("invalid password")
    }
    return user
}


//Cart model
const cartSchema = new mongoose.Schema({
    product: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
        default: 1
    },
    filename: {
        type: String
    },
    userid: {
        type: String,
        required: true
    }
})

cartSchema.statics.findByProduct = async (product) => {
    const cart = await Cart.findOne({ product })
    if (cart) {
        cart.quantity+=1
        cart.save()
    }
    
}


// admin schema
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('"password" can not be used')
            }
        }
    }
})

adminSchema.pre('save', async function(next) {
    const admin = this

    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }

    next()
})

adminSchema.statics.findByCredentials = async (username, password) => {
    const admin = await Admin.findOne({ username })

    if(!admin) {
        throw new Error ("invalid username")
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
        throw new Error ("invalid password")
    }
    return admin
}


const Inventory = mongoose.model('Inventory', inventorySchema)
const User = mongoose.model('User', userSchema)
const Cart = mongoose.model('Cart', cartSchema)
const Admin = mongoose.model('Admin', adminSchema)

module.exports = {
    Admin,
    Inventory,
    User,
    Cart
}
