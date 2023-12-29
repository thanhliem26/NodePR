'use strict'

const express = require('express');
const CartController = require('../../controllers/cart.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication, authenticationV2 } = require('../../auth/authUtils');

router.post('/', asyncHandler(CartController.addToCart))
router.delete('/delete', asyncHandler(CartController.deleteCart))
router.post('/update', asyncHandler(CartController.updateCart))
router.get('/list-cart', asyncHandler(CartController.listToCart))


module.exports = router;
