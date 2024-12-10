'use strict';
const express = require('express');
const CommentController = require('../../controllers/comment.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const router = express.Router()







//AUTHENTICATION
router.use(authentication)
router.post('',asyncHandler(CommentController.createComment))


module.exports = router