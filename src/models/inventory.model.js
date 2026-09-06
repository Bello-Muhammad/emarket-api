import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    productName: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    category: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});

/**
 * @description Adding product to collection
 * @param {*} data 
 * @returns {}
 */
Inventory.statics.addProduct = async (data) => {
    return await Inventory.create(data);
}

/**
 * @description fetch all product
 * @returns [{}] || []
 */
inventorySchema.statics.findManyProduct = async () => {
    const data = await Inventory.find();

    return data ?? [];
}

/**
 * @description fetch a product either by productName, category, or id
 * @param {*} value 'productName || category || id || category && productName'
 * @returns {} || [{}] || []
 */
inventorySchema.statics.findOneProduct = async (value) => {

    const { productName, _id, category } = value;
    let obj = {}

    if(productName && !_id) obj.productName = productName;

    if(_id && !productName) obj._id = _id;

    if(category && !_id && !productName) obj.category = category;

    if(productName && category && _id) {
        obj.productName = productName;
        obj._id = _id;
    }

    return await Inventory.findOne(obj);
}

/**
 * @description Update a product in collection
 * @param String id 
 * @param {*} value 
 * @returns {*}
 */
inventorySchema.statics.updateProduct = async (id, value) => {
    return await Inventory.findByIdAndUpdate(id, value)
}

/**
 * @description Remove a product from collection
 * @param String id 
 * @returns {*}
 */
inventorySchema.statics.removeProduct = async (id) => {
    return await Inventory.findByIdAndDelete(id);
}

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;