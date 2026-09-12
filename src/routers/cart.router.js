const express = require("express");
const CartController = require("../controllers/cart.controller");
const { addItemValidator, updateItemValidator, deleteItemValidator } = require("../middleware/validators/cart.validator");
const validate = require("../middleware/validate");

const cartRouter = express.Router();

cartRouter.post('/', addItemValidator, validate, CartController.addItemToCart);
cartRouter.get('/', CartController.getCart)
cartRouter.patch('/:itemId', updateItemValidator, validate, CartController.increaseOrDecreaseQuantity)
cartRouter.delete('/:itemId', deleteItemValidator, validate, CartController.removeItemOrAllItem)

module.exports = cartRouter;