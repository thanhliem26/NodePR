'use strict';

const DiscountService = require("../services/discount.service");
const { OK, CREATED, SuccessResponse } = require('../core/succes.response');

class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCode = async  (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountAmount = async  (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }

    getAllDiscountCodeWithProducts = async  (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodeWithProducts({
                ...req.query
            })
        }).send(res)
    }
}

module.exports = new DiscountController();
