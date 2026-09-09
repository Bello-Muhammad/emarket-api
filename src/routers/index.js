const express = require("express");
const productRouter = require("./product.router");

const apiRouters = express.Router();

apiRouters.use('/products', productRouter);

module.exports = apiRouters;