'use strict'

const express = require('express');
const AccessController = require('../../controllers/access.controller');
const router = express.Router();

//sign up
router.post('/shop/signup', AccessController.signUp); 

module.exports = router;