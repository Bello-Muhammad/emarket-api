const mongoose = require('mongoose')


const inventorySchema = new mongoose.Schema({
    product: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
        default: 1
    },
    imageUri: {
        type: String
    }
})

//inventorySchema
inventorySchema.statics.findByProduct = async ( product ) => {
    const inventory = await Inventory.findOne({ product })
    if(inventory) {
       throw new Error ('item exist')
    }

}

const Inventory = mongoose.model('Inventory', inventorySchema)

module.exports = Inventory