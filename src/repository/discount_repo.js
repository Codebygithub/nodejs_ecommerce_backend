'use strict'
const {unGetSelectData, getSelectData}  = require('../utils')
const findAllDiscountCodesUnSelect = async({limit , sort ,  page , filter ,unSelect , model}) => {
    const skip = (page - 1 ) * limit
    const sortBy = sort === 'ctime' ? {_id:-1} : {_id:1}
    const discounts = await model.find(filter)
    .skip(skip)
    .sort(sortBy)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    return discounts

}
const findAllDiscountCodesSelect = async({limit , sort ,  page , filter ,select , model}) => {
    const skip = (page - 1 ) * limit
    const sortBy = sort === 'ctime' ? {_id:-1} : {_id:1}
    const discounts = await model.find(filter)
    .skip(skip)
    .sort(sortBy)
    .limit(limit)
    .select(getSelectData(select))
    return discounts

}
const checkDiscountExists = async (model,filter) => {
    return await model.findOne(filter).lean()
}
module.exports = {
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    checkDiscountExists
}