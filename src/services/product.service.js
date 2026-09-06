import Inventory from "../models/inventory.model";

class ProductService {
    /**
     * @description Addnew a new product
     * @argument {product: string, price: number, quantity: number, imageUrl: string} 'in body'
     * @return {object}
     */
    async createProduct(body) {
        const { productName, category } = body;

        //check if product exist
        const doExist = await Inventory.findOneProduct({ productName, category });

        if(doExist) throw new Error('Item already added.');

        const data = await Inventory.addProduct(body);

        return data;
    }
    
}

export default ProductService;