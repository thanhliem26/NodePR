'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name:{
        type: String,
        required:true,
        ref: 'Shop'
    },
    product_thumb:{
        type:String,
        required:true,
    },
    product_description: {
        type:String,
    },
    product_price: {
        type: Number,
       required: true,
    },
    product_quantity: {
        type: String,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true,
    }
}, {
    timestamp: true,
    collection: COLLECTION_NAME
});

const clothingSchema = new Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    colletion: 'clother',
    timestamps: true
})

const electronincSchema = new Schema({
    material: {type: String, required: true},
    model: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    colletion: 'clother',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electrtonic: model('Electronics', electronincSchema),
    clothing: model('Clothing', clothingSchema),
}