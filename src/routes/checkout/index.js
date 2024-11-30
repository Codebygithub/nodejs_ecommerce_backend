'use strict';
const express = require('express');
const CheckoutController = require('../../controllers/checkout.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const router = express.Router()







//AUTHENTICATION
router.use(authentication)
router.post('/review',asyncHandler(CheckoutController.checkoutReview))


module.exports = router