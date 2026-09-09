const express = require("express");
const ProductController = require("../controllers/product.controller");
const validate = require("../middleware/validate");
const { createProductValidator, getorDeleteProductValidator, updateProductValidator } = require("../middleware/validator");

const productRouter = express.Router();

productRouter.post('/add-product', createProductValidator, validate, ProductController.createProduct);
productRouter.get('/', ProductController.getAllProducts);
productRouter.get('/:productId', getorDeleteProductValidator, validate, ProductController.getOneProduct);
productRouter.patch('/:productId', updateProductValidator, validate, ProductController.updateProduct);
productRouter.delete('/:productId', getorDeleteProductValidator, validate, ProductController.deleteProduct)

module.exports = productRouter;