'use strict';

const { BadRequestError, UnauthoriedError, ForbiddenError } = require("../core/error.response");
const {findCartById} = require('../repository/cart_repo')
const {checkProductByServer} = require('../repository/product_repo')
const {getDiscountAmount} = require('../services/discount.service')
class CheckoutService {

    static async checkoutReview({cartId , userId , shop_order_ids = []}) 
    {
        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new BadRequestError(`Cart with ID ${cartId} does not exist`);
    
        const checkout_order = {
            totalPrice: 0, // Tổng tiền
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        };
        const shop_order_ids_new = [];
    
        for (const order of shop_order_ids) {
            const { shopId, shop_discounts = [], item_products = [] } = order;
    
            // Kiểm tra sản phẩm từ server
            const checkedProducts = await checkProductByServer(item_products);
            if (!checkedProducts.length) throw new BadRequestError(`Invalid products in order from shop ${shopId}`);
    
            // Tính giá sản phẩm ban đầu
  
            const checkoutPrice = checkedProducts
            .filter(product => product && product.quantity !== undefined && product.price !== undefined)
            .reduce((acc, product) => acc + product.quantity * product.price, 0);
            checkout_order.totalPrice += checkoutPrice;
    
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkedProducts,
            };
    
            // Áp dụng giảm giá nếu có
            if (shop_discounts.length > 0) {
                const discountData = await getDiscountAmount({
                    code: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkedProducts,
                });
    
                checkout_order.totalDiscount += discountData.discountAmount;
    
                if (discountData.discountAmount > 0) {
                    itemCheckout.priceApplyDiscount = discountData.finalAmount;
                }
            }
    
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_ids_new.push(itemCheckout);
        }
    
        return {
            shop_order_ids_new,
            shop_order_ids,
            checkout_order,
        };
        
    }

   
}
module.exports = CheckoutService