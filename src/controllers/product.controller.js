const ResponseHandler = require("../responseHandler/index.responseHandler");
const ProductService = require("../services/product.service");

class ProductController {
    /**
     * @description Handles adding new product to inventory
     * @param {*} req 'contain incoming http request'
     * @param {*} res 'contain response data sent to client' 
     * @returns (response, statusCode, data) 'return response data'
     */
    static async createProduct (req, res) {        
        try {
            const data = await ProductService.createProduct(req.body);

            return ResponseHandler.success(res, 201, 'Product added successfully', data);
        } catch (error) {
            if(error instanceof Error) {
                return ResponseHandler.Error(res, 400, error.message);
            } else {
                return ResponseHandler.Error(res, 500, 'Internal server error!')
            }
        }
    }

    /**
     * @description Handles fetching of all products from inventory
     * @param {*} req 'contain incoming http request'
     * @param {*} res 'contain response data sent to client' 
     * @returns (response, statusCode, [data]) 'return response data' 
     */
    static async getAllProducts(req, res) {
        try {

            const { page, limit } = req.query;

            const data = await ProductService.getAllProduct(page, limit);

            return ResponseHandler.success(res, 200, 'Products fetched successfully', data);
        } catch (error) {
            if(error instanceof Error) {
                return ResponseHandler.Error(res, 400, error.message);
            } else {
                return ResponseHandler.Error(res, 500, 'Internal server error!')
            }
        }  
    }

    /**
     * @description Handles getting a product by it id, name, or category
     * @param {*} req 
     * @param {*} res 
     * @returns (response, statusCode, dataObject) 'return response data'
     */
    static async getOneProduct(req, res) {
        try {
            const { productId } = req.params; 
            const data = await ProductService.getOneProduct(productId);

            return ResponseHandler.success(res, 200, 'Product fetched successfully', data);
        } catch (error) {
            if(error instanceof Error) {
                return ResponseHandler.Error(res, 400, error.message);
            } else {
                return ResponseHandler.Error(res, 500, 'Internal server error!')
            }
        }  
    }

    /**
     * @description Handle product data update request
     * @param {*} req 
     * @param {*} res 
     * @returns (response, statusCode, {data}) 'return response data'
     */
    static async updateProduct(req, res) {
        try {
            const { productId } = req.params; 
            const data = await ProductService.updateProduct(productId, req.body);

            return ResponseHandler.success(res, 200, 'Product updated successfully', data);
        } catch (error) {
            if(error instanceof Error) {
                return ResponseHandler.Error(res, 400, error.message);
            } else {
                return ResponseHandler.Error(res, 500, 'Internal server error!')
            }
        }  
    }

    /**
     * @description Handle deletion of a product request
     * @param {*} req 
     * @param {*} res 
     * @returns (response, statusCode, [data]) 'return response data'
     */
    static async deleteProduct(req, res) {
        try {
            const { productId } = req.params; 
            const data = await ProductService.deleteProduct(productId);

            return ResponseHandler.success(res, 200, 'Product deleted successfully', data);
        } catch (error) {
            if(error instanceof Error) {
                return ResponseHandler.Error(res, 400, error.message);
            } else {
                return ResponseHandler.Error(res, 500, 'Internal server error!')
            }
        }  
    }
}

module.exports = ProductController;