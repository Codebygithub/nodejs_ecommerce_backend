'use strict';
const express = require('express');
const CommentController = require('../../controllers/comment.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const router = express.Router()







//AUTHENTICATION
router.use(authentication)
router.post('/create',asyncHandler(CommentController.createComment))
router.post('',asyncHandler(CommentController.deleteComments))
router.get('',asyncHandler(CommentController.getCommentByParentId))



module.exports = router