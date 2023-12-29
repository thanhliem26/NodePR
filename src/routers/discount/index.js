'use strict'

const express = require('express');
const DiscountController = require('../../controllers/discount.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication, authenticationV2 } = require('../../auth/authUtils');

//get amount a discount
router.post('/amount', asyncHandler(DiscountController.getAllDiscountAmount));
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodeWithProducts));

//authentication
router.use(authenticationV2);

router.post('/', asyncHandler(DiscountController.createDiscountCode));

module.exports = router;
