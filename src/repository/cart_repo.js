'use strict'

const { cart } = require("../models/cart.model")
const { convertoObjectId } = require("../utils")

const findCartById = async (id) => {
    return await cart.findOne({_id:convertoObjectId(id),cart_state:'active'}).lean()
}
module.exports = {
    findCartById
}