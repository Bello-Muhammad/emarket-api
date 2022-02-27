const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')


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

const User = mongoose.model('User', userSchema)

module.exports = User