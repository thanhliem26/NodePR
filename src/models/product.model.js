'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required
const slugify = require('slugify');
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name:{//quan jean cao cap
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
    product_slug: {// quan-jean-cao-cap
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
    },
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: []},
    isDraft: {type: Boolean, default: true, index: true, select: false},
    isPublish: {type: Boolean, default: false, index: true, select: false}
}, {
    timestamp: true,
    collection: COLLECTION_NAME
});
//create index for search
productSchema.index({product_name: 'text', product_description: 'text'});

//Document middleware: runs before .save() and create()...
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, {lower: true});
    next()
})

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

const funitureSchema = new Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    colletion: 'funitures',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electrtonic: model('Electronics', electronincSchema),
    clothing: model('Clothing', clothingSchema),
    funiture: model('funiture', funitureSchema),
}