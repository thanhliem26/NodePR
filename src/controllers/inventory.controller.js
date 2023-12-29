'use strict';

const InventoryService = require("../services/inventory.service");
const { OK, CREATED, SuccessResponse } = require('../core/succes.response');

class InventoryController {

    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Generations',
            metadata: await InventoryService.addStockToInventory({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

}

module.exports = new InventoryController();
