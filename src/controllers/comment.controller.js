'use strict';

const { Created } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
   createComment = async (req, res,next) => {
        new Created({
                message: 'Success create comment',
                metadata: await CommentService.createComment(req.body)
        }).send(res)

   }    
   deleteComments = async (req, res,next) => {
        new Created({
                message: 'Success delete comment',
                metadata: await CommentService.deleteComments(req.body)
        }).send(res)

   }    
   getCommentByParentId = async (req, res,next) => {
        new Created({
                message: 'Success Get Comment ',
                metadata: await CommentService.getCommentByParentId(req.query)
        }).send(res)

   }  
  
}

module.exports = new CommentController();