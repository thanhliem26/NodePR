'use strict'

const express = require('express');
const AccessController = require('../../controllers/access.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');

//sign up
router.post('/shop/signup', asyncHandler(AccessController.signUp)); 
router.post('/shop/login', asyncHandler(AccessController.login)); 

module.exports = router;