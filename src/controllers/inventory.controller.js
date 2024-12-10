const InventoryService = require('../services/inventory.service')
const { Created } = require("../core/success.response");
const { NotFound } = require('../core/error.response');


class InventoryController {


    /**
     * @desc add to cart for user
     * @param {int} userId 
     * @param {*} res 
     * @param {*} next
     * @method POST
     * @url /v1/api/cart/user
     * @return  {
     *  
     * } 
     */
    ///POST
    addStock= async(req,res,next) =>{
        
        new Created({
            message: ' add Stock  Successfully',
            metadata: await InventoryService.addStocktoInventory(req.body)
        }).send(res)

        
    }
 

   
    ///END QUERY
}
module.exports = new InventoryController()