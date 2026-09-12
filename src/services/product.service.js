const Inventory = require("../models/inventory.model");

class ProductService {
    /**
     * @description Add new product to inventory
     * @argument {product: string, price: number, quantity: number, imageUrl: string} 'in body'
     * @return {object}
     */
    static async createProduct(body) {

        const data = await Inventory.addProduct(body);

        return data;
    }

    /**
     * @description Get all product from inventory
     * @returns [{*}] 'return array of product object'
     */
    static async getAllProduct(page, limit) {

        const parsedLimit = Math.min(parseInt(limit, 10), 50);
        const skip = (parseInt(page, 10) -1) * parsedLimit;

        
        return await Inventory.findManyProduct({parsedLimit, skip}, page);
    }

    /**
     * @description Get a product from inventory
     * @argument id: string 
     * @returns {} 'return product with the unique id
     */
    static async getOneProduct(id) {
        console.log(id)
        const data = await Inventory.findProductById(id);

        if(!data) throw new Error('Product not found');

        return data;
    }

    /**
     * @description The function handle product update
     * @argument id 
     * @argument {*} body 
     * @returns {} 'return update data object'
     */
    static async updateProduct(id, body) {
        const allowedUpdate = ['productName', 'catgory', 'price', 'quantity', 'imageUrl']
        const isValid = Object.keys(body).every(key => allowedUpdate.includes(key));
        const isExist = await Inventory.findProductById(id);

        if(!isExist) throw new Error('Product not found');

        if(!isValid)throw new Error('Invalid field provided for update.');

        return await Inventory.updateProduct(id, body);        
    }

    /**
     * @description The function handles deleting of product
     * @argument id 
     * @returns {} return data object of deleted product
     */
    static async deleteProduct(id) {
        const isExist = await Inventory.findProductById(id);

        if(!isExist) throw new Error('Product not found');

        return await Inventory.removeProduct(id)
    }
    
}

module.exports = ProductService;