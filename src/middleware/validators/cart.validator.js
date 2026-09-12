const { body, param } = require("express-validator");

const addItemValidator = [
    body('productId')
        .notEmpty().withMessage('Item Id field cannot be empty')
        .isString().withMessage('Item Id must be string'),
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
]

const updateItemValidator = [
    param('itemId')
        .exists().withMessage('Item Id is required'),
    body('action')
        .notEmpty().withMessage('Action field cannot be empty')
        .isString().withMessage('Action must be  string'),
]

const deleteItemValidator = [
    param('itemId')
        .exists().withMessage('Item Id is required'),
    body('action')
        .isString().withMessage('Action must be  string')
        .optional(),
]

module.exports = {
    addItemValidator,
    updateItemValidator,
    deleteItemValidator
}