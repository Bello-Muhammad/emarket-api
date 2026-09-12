const express = require("express");
const productRouter = require("./product.router");
const cartRouter = require("./cart.router");

const apiRouters = express.Router();

apiRouters.use('/products', productRouter);
apiRouters.use('/carts', cartRouter)

module.exports = apiRouters;