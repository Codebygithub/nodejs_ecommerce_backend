'use strict';
const express = require('express');
const ProductController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const router = express.Router()





router.get('/search/:keySearch', asyncHandler(ProductController.searchProductByUser))
router.get('/', asyncHandler(ProductController.findAllProduct))

//AUTHENTICATION
router.use(authentication)

router.post('', asyncHandler(ProductController.createProduct))
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(ProductController.unPublishProductByShop))
//QUERY
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
router.get('/publish/all', asyncHandler(ProductController.getAllPublishForShop))
module.exports = router