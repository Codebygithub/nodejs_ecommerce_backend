'use strict'

const {findCartById} = require('../repository/cart_repo')
const {BadRequestError} = require('../core/error.response')
const { checkProductByServer } = require('../repository/product_repo')
const { getDiscountAmount } = require('../services/discount.service')
class CheckoutService {
    static async checkoutReview({cartId , userId , shop_order_ids}){
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequestError('Cart is not Exist')
        const checkout_order = {
            totalPrice:0,
            feeShip:0,
            totalDiscount:0,
            totalCheckout:0
        },shop_order_ids_new = []
        for (let i = 0; i < shop_order_ids.length; i++) {
           const {shopId , shop_discounts =[],item_products = []} = shop_order_ids[i]
           const checkProductServer = await checkProductByServer(item_products)
           if(checkProductServer[0]) throw new BadRequestError('order wrong')
           const checkoutPrice = checkProductServer.reduce((acc,product)=>{
           return acc + (product.quantity * product.price) 
           },0)

           checkout_order.totalPrice += checkoutPrice
           const itemCheckout = {
            shopId , 
            shop_discounts ,
            priceRaw:checkoutPrice, // tien trc khi giam gia
            priceApplyDiscount : checkoutPrice,
            item_products:checkProductServer
           }
           if(shop_discounts.length > 0) {
                const {totalPrice=0 , discount= 0} = await getDiscountAmount({
                    codeId:shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products:checkProductServer
                })
                checkout_order.totalDiscount += discount
                if(discount > 0) itemCheckout.priceApplyDiscount = checkoutPrice - discount

           }
           checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
           shop_order_ids_new.push(itemCheckout)

            
        }
        return  {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }

    }
}
module.exports = CheckoutService