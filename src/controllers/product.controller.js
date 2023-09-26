'use strict'

const productService = require("../services/product.service");
const { OK, CREATED, SuccessResponse } = require('../core/succes.response');
class productController {

    createNewProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'create new product success!',
            metadata: await productService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            }),
        }).send(res)
    }

    publishProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update publish product!',
            metadata: await productService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res)
    }
    
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update publish product!',
            metadata: await productService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list search product!',
            metadata: await productService.searchProduct(req.params),
        }).send(res)
    }
    
    /**
     * 
     * @desc Get all Drafts for shop
     * @param {Number} limit 
     * @param {Number} skip 
     * @return {JSON} next 
     */
    //QUERY//
    getAllDraftForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list draft success!',
            metadata: await productService.findAllDraftForShop({
                product_shop: req.user.userId
            }),
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list public success!',
            metadata: await productService.findAllPublishForShop({
                product_shop: req.user.userId
            }),
        }).send(res)
    }
    //END QUERY//
}

module.exports = new productController