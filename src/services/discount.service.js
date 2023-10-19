'use strict'
const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response');
const discountModel = require('../models/discount.model');
const { findAllDiscountUnSelect } = require('../models/repository/discount.repo');
const { findAllProducts } = require('../models/repository/product.repo');
const { convertToObjectIdMongoDb } = require('../utils');
/*
    Discount Services
    1 - Generator Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [user]
    5 - Delete discount code [Admin | Shop]
    6 - Cancel discount code [user]
*/

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to,
            name, description, type, value, max_uses, uses_count, max_uses_per_user, users_used
        } = payload;
        //Check
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expried')
        }

        if(new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError("Start date must be before end date")
        }

        //create index for discount code
        const foundDiscount = await discountModel.findOne({ discount_code: code, discount_shopId: convertToObjectIdMongoDb(shopId) });
    
        if(foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists')
        }
    
        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_user_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,// so luong cho phep toi da
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to = 'all' ? [] :  product_ids
        })

        return newDiscount;
    }

    static async updateDiscount() {

    }

    //get all discount codes available with products
    static async getAllDiscountCodeWithProduct({
        code, shopId, userId, limit, page
    }) {
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoDb(shopId)
        }).lean();

        if(!foundDiscount || !foundDiscount.discount_is_active) {
            throw new Error("discount not exists")
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;
        if(discount_applies_to === "all") {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongoDb(shopId),
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                select: ['product_name']
            })
        }

        if(discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                select: ['product_name']
            })
        }

        return products;
    }

     //get all discount codes by shopID
     static async getAllDiscountCodeByShop({limit, page, shopId}) {
        const discount = await findAllDiscountUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongoDb(shopId),
                discount_is_active: true,
            },
            unselect: ['___v', 'discount_shopId'],
            model: discountModel
        })

        return discount;
     }
}
