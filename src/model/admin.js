const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')


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


const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin