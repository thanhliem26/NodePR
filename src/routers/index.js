'use strict'

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();
//check api Key
router.use(apiKey)
//check permision
router.use(permission('0000'))

//router handle
router.use('/v1/api', require('./access'))
router.use('/v1/api', require('./product'))
// router.get('/', (req, res, next) => {
//     return res.status(200).json({
//         message: 'Hello word',
//     })
// })


module.exports = router;