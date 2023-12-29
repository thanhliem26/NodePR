'use strict'

const express = require('express');
const CheckoutController = require('../../controllers/checkout.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication, authenticationV2 } = require('../../auth/authUtils');

router.post('/review', asyncHandler(CheckoutController.checkoutReview))

module.exports = router;
