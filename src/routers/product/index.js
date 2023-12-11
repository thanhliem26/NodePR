'use strict'

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication, authenticationV2 } = require('../../auth/authUtils');


router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));
router.get('/', asyncHandler(productController.findAllProduct));
router.get('/:id', asyncHandler(productController.findProduct));
//authentication
router.use(authenticationV2);

router.post('/create', asyncHandler(productController.createNewProduct));
router.patch('/update/:productId', asyncHandler(productController.updateProduct));
router.post('/publish/:id', asyncHandler(productController.publishProduct));
router.post('/unPublish/:id', asyncHandler(productController.unPublishProductByShop));
//QUERY//
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop));
router.get('/publish/all', asyncHandler(productController.getAllPublishForShop));

module.exports = router;
