const CheckService = require('../services/checkout.service')
const { Created } = require("../core/success.response");
const { NotFound } = require('../core/error.response');


class CheckoutController {


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
    checkoutReview= async(req,res,next) =>{
        
        new Created({
            message: 'Create Cart Successfully',
            metadata: await CheckService.checkoutReview(req.body)
        }).send(res)

        
    }
 

   
    ///END QUERY
}
module.exports = new CheckoutController()