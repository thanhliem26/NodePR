'use strict'

const Comment = require('../models/comment.model');
const { convertNewToObjectIdMongoDb } = require('../utils');

/**
 * key features: comment service
 * + add comment [user, shop]
 * + get a list of comments [user, shop]
 * + delete a comment [user, shop, admin
 * ]
 */
class CommentService {
    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue;

        if(parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);

            if(!parentComment) throw new NotFoundError('parent comment not found');

            rightValue = parentComment.comment_right;
            //updateMany comments

            await Comment.updateMany({
                comment_productId: convertNewToObjectIdMongoDb(productId),
                comment_right: {$gte: rightValue}
            }, {
                $inc: { comment_right: 2}
            })

            await Comment.updateMany({
                comment_productId: convertNewToObjectIdMongoDb(productId),
                comment_left: {$gte: rightValue}
            }, {
                $inc: { comment_left: 2}
            })
        } else {
            const maxRightValue = await Comment.findOne({
                comment_productId: convertNewToObjectIdMongoDb(productId)
            }, 'comment_right', {sort: {comment_right: -1}})

            if(maxRightValue) {
                rightValue = maxRightValue + 1
            } else {
                rightValue = 1
            }
        }

        //insert to comment
        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        await comment.save()

        return comment;
    }
}

module.exports = CommentService;
