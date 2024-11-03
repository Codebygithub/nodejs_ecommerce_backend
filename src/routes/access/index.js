'use strict';
const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const router = express.Router()


//SIGNUP
router.post('/shop/signup', asyncHandler(accessController.signUp))

//LOGIN
router.post('/shop/login', asyncHandler(accessController.login))
module.exports = router