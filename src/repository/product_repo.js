'use-strict'
const { Types } = require('mongoose')
const {product , electronic , clothing , funiture} = require('../models/product.model')

const findAllDraftsForShop = async({query , limit , skip}) => {
   return await queryProduct({query, limit,skip})
}
const findAllPublishsForShop = async({query , limit , skip}) => {
    return await queryProduct({query, limit,skip})
 }
const publishProductByShop = async ({product_shop , product_id}) => {
    const foundShop = await product.findOne({
        product_shop :  new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null 
    foundShop.isDraft = false ;
    foundShop.isPublished = true;
    await foundShop.save();
    return foundShop
}
const queryProduct = async ({query,limit,skip}) => {
    return await product.find(query)
    .populate('product_shop','name email -_id')
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}
module.exports ={
    findAllDraftsForShop ,
    findAllPublishsForShop,
    publishProductByShop,
}