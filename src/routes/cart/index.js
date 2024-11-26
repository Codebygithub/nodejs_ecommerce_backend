'use strict';
const express = require('express');

const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const CartController= require('../../controllers/cart.controller');

const router = express.Router()
//AUTHENTICATION
router.use(authentication)
router.post('',asyncHandler(CartController.addToCart))

module.exports = router