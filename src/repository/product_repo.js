'use-strict'
const { Types } = require('mongoose')
const {product , electronic , clothing , funiture} = require('../models/product.model')
const {getSelectData,unGetSelectData, convertoObjectId} = require('../utils/index')
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
const unPublishProductByShop = async ({product_shop , product_id}) => {
    const foundShop = await product.findOne({
        product_shop : new Types.ObjectId(product_shop),
        _id:new Types.ObjectId(product_id)
    })
    if(!foundShop) return null ;
    foundShop.isDraft = true ;
    foundShop.isPublished = false ;
    foundShop.save();
    return foundShop
}

const searchProductByUser = async ({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
        const rs = await product.find({
            isPublished:true,
            $text:{$search: regexSearch}
        },{score:{$meta:'textScore'}})
        .sort({score:{$meta:'textScore'}})
        .lean()
        console.log('rs')
        return rs; 
}
const findAllProduct = async({limit , sort ,  page , filter ,select}) => {
    const skip = (page - 1 ) * limit
    const sortBy = sort === 'ctime' ? {_id:-1} : {_id:1}
    const products = await product.find(filter)
    .skip(skip)
    .sort(sortBy)
    .limit(limit)
    .select(getSelectData(select))
    

    return products

}
const findProduct = async({product_id , unselect}) => {
    return await product.findById(product_id).select(unGetSelectData(unselect))
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
const getProductById = async (productId) => {
    return await product.findOne({
        _id: convertoObjectId(productId)
    }).lean()
}

const updateProductById = async({productId,payload,model,isNew = true}) => {
    return await model.findByIdAndUpdate(productId,payload,{
        new:isNew
    })
}
const checkProductByServer = async (products) => {
   return await Promise.all(products.map(async product => {
        const foundProduct = await getProductById(product.productId)
        if(foundProduct) {
            return {
                price:foundProduct.product_price,
                quantity:product.quantity,
                productId:product.productId
            }

        }
   }))
};





module.exports ={
    findAllDraftsForShop ,
    findAllPublishsForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProduct,
    findProduct,
    updateProductById,
    getProductById,
    checkProductByServer
}