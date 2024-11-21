'use strict';
const express = require('express');
const DiscountController = require('../../controllers/discount.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const router = express.Router()


router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
router.get('/list_produt_code', asyncHandler(DiscountController.getAllDiscountCodesWithProduct))
//AUTHENTICATION
router.use(authentication)
router.post('',asyncHandler(DiscountController.createDiscount))
router.get('',asyncHandler(DiscountController.getAllDiscountCodesWithProduct))
module.exports = router