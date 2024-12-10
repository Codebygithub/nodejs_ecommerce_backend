'use strict'

const {findCartById} = require('../repository/cart_repo')
const {BadRequestError} = require('../core/error.response')
const { checkProductByServer } = require('../repository/product_repo')
const { getDiscountAmount } = require('../services/discount.service')
const { acquireLock, releaseLock } = require('./redis.service')
const {order} = require('../models/order.model')
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
    static async orderByUser({shop_order_ids,cartId,userId,user_address = {},user_payment = {}}) {
        const {shop_order_ids_new , checkout_order} = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log('products :' + products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
           const {productId ,quantity} = products[i];
           const keyLock = await acquireLock(productId, quantity,cartId)
           acquireProduct.push(keyLock ? true : false)
           if(keyLock) {
            await releaseLock(keyLock)
           }
            
        }
        if(acquireProduct.includes(false)) {
            throw new BadRequestError('mot so san pham da duoc cap nhat , vui long quay lai cua hang ')

        }
        const newOrder =await order.create({
            order_userId:userId,
            order_checkout:checkout_order,
            order_shipping:user_address,
            order_payment:user_payment,
            order_products:shop_order_ids_new
        })
        if(newOrder) 
        {
            
        }
        return newOrder
    }

}
module.exports = CheckoutService