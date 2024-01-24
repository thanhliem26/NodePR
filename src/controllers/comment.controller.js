'use strict';

const CommentService = require("../services/comment.service");
const { OK, CREATED, SuccessResponse } = require('../core/succes.response');

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'create new comment',
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }
}

module.exports = new CommentController();
