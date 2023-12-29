'use strict'

const { BadRequestError } = require('../core/error.response');
const inventoryModel = require('../models/inventory.model');
const InventoryModel = require('../models/inventory.model');
const { getProductById } = require('../models/repository/product.repo');

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = 'La Khe - Ha Dong'
    }) {
        const product = await getProductById(productId);
        if(!product) throw new BadRequestError("The product does not exists");

        const query = { inven_shopId: shopId, inven_productId: productId};
        const udpateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }
        const options = { upsert: true, new: true }

        return await inventoryModel.findOneAndUpdate(query, udpateSet, options)
    }
}

module.exports = InventoryService;
