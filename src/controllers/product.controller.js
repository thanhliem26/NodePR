'use strict'

const productService = require("../services/product.service");
const { OK, CREATED, SuccessResponse } = require('../core/succes.response');
class productController {

    createNewProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'create new product success!',
            metadata: await productService.createProduct(req.body.product_type, req.body),
        }).send(res)
    }
}

module.exports = new productController