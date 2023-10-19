'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

// Declare the Schema of the Mongo model
var DiscountSchema = new Schema({
    discount_name:{
        type: String,
        required:true,
    },
    discount_description:{
        type: String,
    },
    discount_type:{//percentage
        type: String,
        default: 'fixed_amount'
    },
    discount_value:{//10.000
        type: Number,
        required:true,
    },
    discount_code:{//discountCode
        type: String,
        required:true,
    },
    discount_start_date:{//ngày bắt đầu
        type: Date,
        required:true,
    },
    discount_end_date:{//ngày kết thúc
        type: Date,
        required:true,
    },
    discount_max_uses:{//số lượng discount dc ap dung
        type: Date,
        required:true,
    },
    discount_user_count:{
        type: Number,
        required:true,
    },
    discount_users_used: {//ai da dung
        type: Array,
        default: []
    },
    discount_max_uses_per_user: { type: Number, required: true},// so luong cho phep toi da
    discount_min_order_value: { type: Number, required: true},
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop'},
    discount_is_active: { type: Boolean, default: true},
    discount_applies_to: {type: String, require: true, enum: ['all', 'specific']},
    discount_product_ids: { type: Array, default: []} //so san pham duoc ap dung
}, {
    timestamp: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, DiscountSchema);
