'use strict';

const CartService = require("../services/cart.service");
const { OK, CREATED, SuccessResponse } = require('../core/succes.response');

class CartController {
    /**
     * @desc add to cart for user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Cart Success',
            metadata: await CartService.addToCart( req.body )
        }).send(res)
    }

    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Cart Success',
            metadata: await CartService.addToCartV2( req.body )
        }).send(res)
    }

    deleteCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Cart Success',
            metadata: await CartService.deleteUserCart( req.body )
        }).send(res)
    }

    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'List Cart Success',
            metadata: await CartService.getListUserCart( req.query )
        }).send(res)
    }
}

module.exports = new CartController();
