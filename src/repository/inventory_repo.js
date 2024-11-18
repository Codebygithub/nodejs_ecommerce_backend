const {inventory} = require('../models/inventory.model')
const { Types} = require('mongoose')
const insertInventory = async ({
    productId , shopId , stock , location = 'unknown',
}) =>{

    return await inventory.create({
        inven_productId:productId,
        inven_stock:stock ,
        inven_localtion :location,
        inven_shopIid:shopId,
    })

}
module.exports = {
    insertInventory
}