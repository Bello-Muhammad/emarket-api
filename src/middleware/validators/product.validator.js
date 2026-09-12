const { body, param } = require("express-validator");
const Inventory = require("../../models/inventory.model");

const createProductValidator = [
    body('productName')
        .notEmpty().withMessage('Product name field cannot be empty')
        .isString().withMessage('Product name must be string')
        .custom(async (value) => {
            //check if product exist already
            const result = await Inventory.findOneProduct({ productName: value })

            if(result) throw new Error('Product already added to store');

            return true;
        }),
    body('category')
        .notEmpty().withMessage('Category field cannot be empty')
        .isString().withMessage('Category value must be string'),
    body('price')
        .notEmpty().withMessage('Price field can not be empty')
        .isFloat().withMessage('Price must be a positive integergreater than 0')
        .custom((value) => {
            //ensures the price has not more than 2 decimal places
            const decimalRegex = /^\d+(\.\d{1,2})?$/;
            if(!decimalRegex.test(value.toString())) {
                throw new Error('Price can only have at most 2 decimal place');
            }

            return true;
        })
        .toFloat(),
    body('quantity')
        .notEmpty().withMessage('Quantity can not be empty')
        .isInt({ min: 1 }).withMessage('Quantity must be an integer of at least 1')
        .toInt(),
    body('imageUrl')
        .notEmpty().withMessage('Image link field cannot be empty')
        .isString().withMessage('Image Link must be string'),
]

const updateProductValidator = [
    param('productId')
        .exists().withMessage('product Id is required'),
    body('productName')
        .isString().withMessage('Product name must be  string')
        .optional(),
    body('category')
        .isString().withMessage('category must be string')
        .optional(),
   body('price')
        .isFloat().withMessage('Price must be a positive integergreater than 0')
        .toFloat()
        .optional(),
    body('quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be an integer of at least 1')
        .toInt()
        .optional(),
]

const getorDeleteProductValidator = [
    param('productId')
        .exists().withMessage('product Id is required')
]

module.exports = {
    createProductValidator,
    getorDeleteProductValidator,
    updateProductValidator,
}