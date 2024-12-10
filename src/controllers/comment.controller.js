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
  
}

module.exports = new CommentController();