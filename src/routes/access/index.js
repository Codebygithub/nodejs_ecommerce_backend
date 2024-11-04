'use strict';
const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const router = express.Router()


//SIGNUP
router.post('/shop/signup', asyncHandler(accessController.signUp))

//LOGIN
router.post('/shop/login', asyncHandler(accessController.login))
//AUTHENTICATION
router.use(authentication)
//LOGOUT
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handleRefreshtoken', asyncHandler(accessController.handleRefreshToken))
module.exports = router