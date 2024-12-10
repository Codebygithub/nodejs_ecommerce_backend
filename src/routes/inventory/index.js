'use strict';
const express = require('express');
const InventoryController = require('../../controllers/inventory.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const router = express.Router()







//AUTHENTICATION
router.use(authentication)
router.post('/review',asyncHandler(InventoryController.addStock))


module.exports = router