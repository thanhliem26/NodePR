'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventorys';

// Declare the Schema of the Mongo model
var InventorySchema = new Schema({
    inven_productId: { type: Schema.Types.ObjectId, ref: 'Product'},
    inven_location: { type: String, default: 'unKnow'},
    inven_stock: { type: Number, required: true},
    inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop'},
    inven_reservations: { types: Array, default: {}}
}, {
    timestamp: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, InventorySchema);