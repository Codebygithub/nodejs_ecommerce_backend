'use strict';
const express = require('express');
const ProductController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const router = express.Router()






//AUTHENTICATION
router.use(authentication)

router.post('', asyncHandler(ProductController.createProduct))

//QUERY
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
module.exports = router