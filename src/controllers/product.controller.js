import ResponseHandler from "../responseHandler/index.responseHandler";
import ProductService from "../services/product.service";

class ProductController {
    async createProduct (req, res) {
        try {
            const data = await ProductService.createProduct(req.body);

            return ResponseHandler.success(res, 201, 'Product added successfully', data);
        } catch (error) {
            if(e instanceof error) {
                return ResponseHandler.Error(res, 400, e.message);
            } else {
                return ResponseHandler.Error(res, 500, 'Internal server error!')
            }
        }
    } 
}

export default ProductController;