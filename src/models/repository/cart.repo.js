'use strict'
const { convertNewToObjectIdMongoDb } = require('../../utils');
const cartModel = require('../cart.model');


const findCardById = async (cartId) => {
    return await cartModel.findOne({_id: convertNewToObjectIdMongoDb(cartId), cart_state: 'active'}).lean()
}

module.exports = {
    findCardById
}
