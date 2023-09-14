'use strict'

const express = require('express');
const AccessController = require('../../controllers/access.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');

//sign up
router.post('/shop/signup', asyncHandler(AccessController.signUp)); 
router.post('/shop/login', asyncHandler(AccessController.login)); 

//authentication
router.use(authentication);

//logout
router.post('/shop/logout', asyncHandler(AccessController.logout));
router.post('/shop/handleRefreshToken', asyncHandler(AccessController.handleRefreshToken));

module.exports = router;