const Cart = require("../models/cart.model");

class CartService {
    static async addItemToCart(body) {
        const { productId } = body;
        const ifExist = await Cart.findOneItemInCart({ productId });

        if(ifExist) {
            const quantity = ifExist.quantity + 1
            const totalPrice = ifExist.product.price * quantity;

            return await Cart.updateCartItem(ifExist._id, {quantity, totalPrice})
        }

        const quantity = body.quantity ?? 1;
        const totalPrice = body.price * quantity;

        //Have to add userId to the data value passed and update cart model too
        return await Cart.addItemToCart({productId, quantity, totalPrice})
    }

    static async getCart(productId) {
        return await Cart.findCart(productId)
    }

    static async increaseOrDecreaseQuantity (id, action) {
        const ifExist = await Cart.findItemById(id);
        let quantity;

        if(!ifExist) throw new Error('Item to increase not found')

        if(action === 'add') quantity = ifExist.quantity + 1;
        
        if(action === 'minus') {
  
            if(ifExist.quantity === 1) {
                 await Cart.removeItem(ifExist._id);
                 return {message: 'Item removed successfully as quantity is 0.'}
            }

            quantity = ifExist.quantity - 1;

        }
        
        const totalPrice = ifExist.product.price * quantity;

        return await Cart.updateCartItem(ifExist._id, {quantity, totalPrice})
    }

    static async removeItemOrAllItem(id) {

        const ifExist = await Cart.findItemById(id);

        if(!ifExist) throw new Error('Data not found')

        return await Cart.removeItem(id);
    }
}

module.exports = CartService;