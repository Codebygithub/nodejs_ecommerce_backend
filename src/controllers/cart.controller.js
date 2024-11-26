const CartService = require('../services/cart.service')
const { Created } = require("../core/success.response");
const { NotFound } = require('../core/error.response');


class CartController {

    ///POST
    addToCart= async(req,res,next) =>{
        const {userId , product} = req.body
        new Created({
            message: 'Create Cart Successfully',
            
            metadata: await CartService.addToCart({
                userId,product
            })
        }).send(res)

        
    }

   
    ///END QUERY
}
module.exports = new CartController