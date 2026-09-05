const mongoose = require('mongoose')



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
    imageUri: {
        type: String
    },
    userid: {
        type: String,
        required: true
    }
})

cartSchema.statics.findByProduct = async (product, next) => {
    const cart = await Cart.findOne({ product })
    if (cart) {
        cart.quantity+=1
        cart.save()
    }
    
    next()
}


const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart