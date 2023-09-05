'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'Apikeys';

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    key:{
        type: String,
        required:true,
        unique: true,
    },
    status:{
        type:Boolean,
        default:true,
    },
    permissions: {
        type:[String],
        required:['0000', '1111', '2222'],
    },
}, {
    timestamp: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);