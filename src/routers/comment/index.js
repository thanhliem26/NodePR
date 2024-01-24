'use strict'

const express = require('express');
const CommentController = require('../../controllers/comment.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication, authenticationV2 } = require('../../auth/authUtils');

router.use(authenticationV2)

router.post('', asyncHandler(CommentController.createComment))

module.exports = router;
