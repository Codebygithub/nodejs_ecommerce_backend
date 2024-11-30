const CartService = require('../services/cart.service')
const { Created } = require("../core/success.response");
const { NotFound } = require('../core/error.response');


class CartController {


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
    addToCart= async(req,res,next) =>{
        new Created({
            message: 'Create Cart Successfully',
            metadata: await CartService.addtoCart(req.body)
        }).send(res)

        
    }
    update= async(req,res,next) =>{
        new Created({
            message: 'Update Cart Successfully',
            metadata: await CartService.updateCart(req.body)
        }).send(res)

        
    }
    delete= async(req,res,next) =>{
        new Created({
            message: 'delete Cart Successfully',
            metadata: await CartService.deleteItemInCart(req.body)
        }).send(res)

        
    }

    listToCart= async(req,res,next) =>{
      
        new Created({
            message: 'get list Cart Successfully',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)

        
    }

   
    ///END QUERY
}
module.exports = new CartController()