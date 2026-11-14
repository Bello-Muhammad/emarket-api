const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose({
    firstName: {
        type: String,
        require: true,
        trim: true
    },
    lastName: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
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
        require: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('"password" can not be used')
            }
        }
    },
    address: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: Number,
        require: true,
        minlength: 11
    },
    role: {
        type: String,
    }
}, {
    timestamps: true
});

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password

    return userObject
}

/**
 * @description The mehod hash user password before saving by intercepting data when writing data to db
 * @returns
 */
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

/**
 * @description Fetch user data
 * @arguments (email)
 * @returns {}
 */
userSchema.statics.findUser = async (email) => {
    return await Uesr.findOne({ email });
}


/**
 * @description fetch a user data by id
 * @arguments (string) id
 * @returns {} 
 */
userSchema.statics.findUserById = async (id) => {
    return await Uesr.findById(id);
}

/**
 * @description Update user datat in collection
 * @arguments (string, {}) 'id, data'
 * @returns {*}
 */
userSchema.statics.updateUser = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { returnDocument: 'after' })
}

/**
 * @description Remove user details
 * @arguments (string) id 
 * @returns {*}
 */
userSchema.statics.deleteUser = async (id) => {
    return await User.findByIdAndDelete(id)
}

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

const User = mongoose.model('User', userSchema);

module.exports = User;