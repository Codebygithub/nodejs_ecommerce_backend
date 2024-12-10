'use strict'

const { NotFound } = require('../core/error.response')
const {inventory} = require('../models/inventory.model')
const { getProductById } = require('../repository/product_repo')
class InventoryService {
    static async addStocktoInventory({
        stock , productId , shopId , 
        location = '134, Tran Phu , HCM City'
    }){

        const product = await getProductById(productId)
        if(!product) throw new NotFound('Product not found')
        const query = {inven_shopId:shopId,inven_productId:productId},
        updateSet = {
            $inc:{
                inven_stock:stock
            },
            $set:{
                inven_location:location
            }
        },options = {usert:true , new:true}
        return await inventory.findOneAndUpdate(query,updateSet,options)

    }
    
}
module.exports = InventoryService