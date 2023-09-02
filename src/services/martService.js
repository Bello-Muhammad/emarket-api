const Inventory = require('../model/inventory')
const Cart = require('../model/cart')
const User = require('../model/user')
const async = require('hbs/lib/async')

const post_AddProduct = async (body) => {
    let {product} = body.product
    await Inventory.findByProduct(product)

    return await Inventory.create(body)
}

const products = async () => {

    return await Inventory.find();
}

const post_Cart = async (userid, body) => {

    let {_id} = body
    const invent = await Inventory.findOne({ _id });
    const { product, price, quantity, imageUri} = invent
    const carts = await Cart.findByProduct(product)
    let data = {
        product,
        price,
        quantity,
        imageUri, 
        userid
    }

    if(carts) {
        throw new Error('item exist in cart')
    }

    return await Cart.create(data)

}

const get_Cart = async (userid) => {
    const cart = await Cart.find({ userid })

    const prods = cart.map(p => {
        const product = p
        product.price = p.price * p.quantity;
        return product
    })

    let price = 0

    prods.forEach(p => {
        price += p.price
    })

    let carts = { ...prods, price }
    return carts;
    
}

const cart_Increment = async (body) => {
    const cart = await Cart.findOne({_id: body.productId});

    if(body.action === 'increment') {
        cart.quantity += 1;
        await cart.save()
    } else{
        if(cart.quantity > 1 ) {
            cart.quantity -= 1;
            await cart.save();
        }else{
            await Cart.findOneAndDelete({_id: body.productId})
        }
    }

    return 'Ok'
}

const remove_CartItem = async (body) => {
    return await Cart.findByIdAndDelete({_id: body.productId})
}

const updateProduct = async (body) => {
    return await Inventory.findByIdAndUpdate({_id: body.productId}, {...body})
}

const removeProduct = async (body) => {
    return await Inventory.findByIdAndDelete({_id: body.productId})
}

const get_CheckOut = async (userId) => {
    return await User.findOne({_id: userId});
}

const post_CheckOut = async (userId, body) => {
    return await User.findByIdAndUpdate({_id: userId}, {address: body.address})
}

const Payment = async (userid) => {
    const cart = await Cart.find({ userid })

        const prods = cart.map(p => {
            const product = p
            product.price = p.price * p.quantity;
            return product
        })
    
        let price = 0
    
        prods.forEach(p => {
            price += p.price
        })
    
        let carts = price
        return carts;
}

module.exports = {
    post_AddProduct,
    products,
    post_Cart,
    get_Cart,
    cart_Increment,
    remove_CartItem,
    updateProduct,
    removeProduct,
    get_CheckOut,
    post_CheckOut,
    Payment
}