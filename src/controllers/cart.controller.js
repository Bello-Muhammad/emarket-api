const ResponseHandler = require("../responseHandler/index.responseHandler");
const CartService = require("../services/cart.service");

class CartController {
    static async addItemToCart(req, res) {
        try {

            const data = await CartService.addItemToCart(req.body)

            return ResponseHandler.success(res, 201, 'Item added to cart successfully', data);
        } catch (error) {
            if(error instanceof Error) {
                return ResponseHandler.Error(res, 400, error.message);
            } else {
                return ResponseHandler.Error(res, 500, 'Internal server error!')
            }
        }  
    }

    static async getCart(req, res) {
        try {

            const data = await CartService.addItemToCart("6a9f050c6637a925b73c5dd7");

            return ResponseHandler.success(res, 200, 'Cart fetch successfully', data);
        } catch (error) {
            if(error instanceof Error) {
                return ResponseHandler.Error(res, 400, error.message);
            } else {
                return ResponseHandler.Error(res, 500, 'Internal server error!')
            }
        }  
    }

    static async increaseOrDecreaseQuantity (req, res) {
        try {

            const data = await CartService.increaseOrDecreaseQuantity(req.params.itemId, req.body.action)

            return ResponseHandler.success(res, 200, data.message ?? 'Request action done successfully', data);
        } catch (error) {
            if(error instanceof Error) {
                return ResponseHandler.Error(res, 400, error.message);
            } else {
                return ResponseHandler.Error(res, 500, 'Internal server error!')
            }
        } 
    }

    static async removeItemOrAllItem (req, res) {
        try {

            const data = await CartService.removeItemOrAllItem(req.params.itemId)

            return ResponseHandler.success(res, 201, 'Item added to cart successfully', data);
        } catch (error) {
            if(error instanceof Error) {
                return ResponseHandler.Error(res, 400, error.message);
            } else {
                return ResponseHandler.Error(res, 500, 'Internal server error!')
            }
        } 
    }
}

module.exports = CartController;