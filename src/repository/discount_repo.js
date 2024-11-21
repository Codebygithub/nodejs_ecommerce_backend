'use strict';

const {unGetSelectData} = require('../utils/index')
const findAllDiscountCodeUnSelect = async({limit = 50 , page = 1 , sort = 'ctime' , filter , unSelect , model}) => {
    const skip = (page - 1 ) * limit
    const sortBy = sort === 'ctime' ? {_id:-1} : {_id:1}
    const products = await model.find(filter)
    .skip(skip)
    .sort(sortBy)
    .limit(limit)
    .select(unGetSelectData(select))
    .lean()

    return products
    
}

const findAllDiscountCodeSelect = async({limit = 50 , page = 1 , sort = 'ctime' , filter , unSelect , model}) => {
    const skip = (page - 1 ) * limit
    const sortBy = sort === 'ctime' ? {_id:-1} : {_id:1}
    const products = await model.find(filter)
    .skip(skip)
    .sort(sortBy)
    .limit(limit)
    .select(unGetSelectData(select))
    .lean()

    return products
    
}
const checkDiscountExist = async (model,filter) => {
    return await model.findOne(filter).lean();
}
module.exports =  {
    findAllDiscountCodeUnSelect,
    findAllDiscountCodeSelect,
    checkDiscountExist
}
