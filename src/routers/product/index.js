'use strict'

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication, authenticationV2 } = require('../../auth/authUtils');


router.get('/product/:keySearch', asyncHandler(productController.getListSearchProduct));
//authentication
router.use(authenticationV2);

router.post('/product/create', asyncHandler(productController.createNewProduct));
router.post('/product/publish/:id', asyncHandler(productController.publishProduct));
router.post('/product/unPublish/:id', asyncHandler(productController.unPublishProductByShop));
//QUERY//
router.get('/product/drafts/all', asyncHandler(productController.getAllDraftForShop));
router.get('/product/publish/all', asyncHandler(productController.getAllPublishForShop));

module.exports = router;