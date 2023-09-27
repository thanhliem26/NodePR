'use strict'

const { populate } = require('../apiKey.model');
const { product, electrtonic, clothing, funiture } = require('../product.model');
const { Types } = require('mongoose')
const { getSelectData, unGetSelectData } = require('../../utils/index')

const findAllDraftForShop = async function ({ query, limit = 50, skip = 0 }) {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async function ({ query, limit = 50, skip = 0 }) {
    return await queryProduct({ query, limit, skip })
}

const publishProductByShop = async function ({ product_shop, product_id }) {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublish = true;
    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return modifiedCount;
}

const unPublishProductByShop = async function ({ product_shop, product_id }) {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if (!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublish = false;
    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return modifiedCount;
}

const searchProductByUser = async function ({ keySearch }) {
    const regexSearch = new RegExp(keySearch);
    const results = await product.find({
        isDraft: false,
        $text: { $search: regexSearch },
    }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .lean();

    return results;
}

const queryProduct = async ({ query, limit = 50, skip = 0 }) => {
    return await product.find(query).
        populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllProducts = async ({ limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit
    const sortBy = sort = 'ctime' ? {_id: -1} : {_id: 1};
    const prodcts = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return prodcts;
}

const findProduct = async ({ product_id, unSelect }) => {
   return await product.findById(product_id).select(unGetSelectData(unSelect))
}

module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct
};