const mongoose = require('mongoose')

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
},{
    timestamps: true
});

/**
 * @description Adding product to collection
 * @param {*} data 
 * @returns {}
 */
inventorySchema.statics.addProduct = async (data) => {
    return await Inventory.create(data);
}

/**
 * @description fetch all product
 * @returns [{}] || []
 */
inventorySchema.statics.findManyProduct = async (obj, page) => {
    const { parsedLimit, skip} = obj;

    const data = await Inventory.find()
        .skip(skip)
        .limit(parsedLimit);
    
    return {count: data.length, page, data} ?? [];
}

/**
 * @description fetch a product either by productName, category, or id
 * @param {*} value 'productName || category || id || category && productName'
 * @returns {} || [{}] || []
 */
inventorySchema.statics.findOneProduct = async (value) => {

    const { productName, id, category } = value;
    let obj = {}

    if(productName) obj.productName = productName;

    if(id) obj._id = id;

    if(category) obj.category = category;

    return await Inventory.findOne(obj);
}

/**
 * @description fetch a product either by id
 * @param (string) id
 * @returns {} 'product object'
 */
inventorySchema.statics.findProductById = async (id) => {
    return await Inventory.findById(id);
}

// inventorySchema.static.searchForProduct

/**
 * @description Update a product in collection
 * @param String id 
 * @param {*} value 
 * @returns {*}
 */
inventorySchema.statics.updateProduct = async (id, value) => {
    return await Inventory.findByIdAndUpdate(id, value,{ new: true})
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

module.exports = Inventory;