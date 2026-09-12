const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    totalPrice: {
        type: Number,
        required: true
    }
},{
    timestamps: true
});

cartSchema.statics.addItemToCart = async (body) => {

    return await Cart.create({...body, product: body.productId});
}

cartSchema.statics.findCart = async (productId) => {
    return Cart.find({ productId });
}

cartSchema.statics.findOneItemInCart = async (value) => {
    const { productId, userId } = value;
    const obj = {};

    if(productId) obj.productId = productId;
    
    if(userId) obj.userId = userId;

    if(!productId && userId) {
        throw new Error('Invalid key value provided');
    }

    return await Cart.findOne(obj).populate('product');
}

cartSchema.statics.findItemById = async (id) => {
    return await Cart.findById(id).populate('product');
}

cartSchema.statics.updateCartItem = async (id, value) => {
    return await Cart.findByIdAndUpdate(id, value, { returnDocument: 'after' });
}

cartSchema.statics.removeAllItem = async(body) => {
    return await Cart.deleteMany({})
}

cartSchema.statics.removeItem = async (id) => {
    return await Cart.findByIdAndDelete(id)
}

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;