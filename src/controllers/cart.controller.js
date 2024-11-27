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
        const {userId , product} = req.body
        new Created({
            message: 'Create Cart Successfully',
            metadata: await CartService.addtoCart({
                userId,product
            })
        }).send(res)

        
    }
    update= async(req,res,next) =>{
        const {userId , product} = req.body
        new Created({
            message: 'Update Cart Successfully',
            metadata: await CartService.updateCartQuantity({
                userId,product
            })
        }).send(res)

        
    }
    delete= async(req,res,next) =>{
        const {userId , product} = req.body
        new Created({
            message: 'delete Cart Successfully',
            metadata: await CartService.deleteItemInCart({
                userId,product
            })
        }).send(res)

        
    }

    listToCart= async(req,res,next) =>{
        const userId = req.query.userId
        if(!userId) throw new NotFound('userId not found')
        new Created({
            message: 'get list Cart Successfully',
            metadata: await CartService.getListUserCart({userId})
        }).send(res)

        
    }

   
    ///END QUERY
}
module.exports = new CartController()