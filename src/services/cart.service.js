'use strict'
const { NotFound, BadRequestError } = require('../core/error.response');
const {cart}= require('../models/cart.model');
const { inventory } = require('../models/inventory.model');
const {convertoObjectId} = require('../utils')
const {getProductById} = require('../repository/product_repo')

class CartService {


    static async updateCartQuantity({ userId, product }) {
        const { productId, quantity } = product;
    
        // Tìm sản phẩm trong giỏ hàng
        const existingCart = await cart.findOne({
            cart_userId: userId,
            cart_state: 'active',
            'cart_products.productId': productId,
        });
    
        if (!existingCart) {
            // Nếu sản phẩm không tồn tại, thêm sản phẩm vào giỏ
            return await cart.findOneAndUpdate(
                { cart_userId: userId, cart_state: 'active' },
                {
                    $addToSet: {
                        cart_products: product,
                    },
                },
                { upsert: true, new: true }
            );
        }
    
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        return await cart.findOneAndUpdate(
            {
                cart_userId: userId,
                'cart_products.productId': productId,
                cart_state: 'active',
            },
            {
                $inc: {
                    'cart_products.$.quantity': quantity,
                },
            },
            { new: true }
        );
    }
    static async createCart({ userId, product }) {
       const query = {cart_userId:userId,cart_state:'active'},
       updateOrInsert = {
        $addToSet:{
            cart_products:product
        }
       },options = {upsert:true , new:true}
       return await cart.findOneAndUpdate(query , updateOrInsert,options)
    }
  
    static async addtoCart({userId ,product = {}}) {
      const userCart = await cart.findOne({cart_userId:userId})
      if(!userCart) {
        return await CartService.createCart({userId , product})
      }
      if(!userCart.cart_products.length) {
        userCart.cart_products = [product]
        return await userCart.save()
      }
      return await CartService.updateCartQuantity({userId,product})
    }
   static async deleteItemInCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' };
        const updateSet = {
            $pull: {
                cart_products: { productId },
            },
        };

        const deleteResult = await cart.updateOne(query, updateSet);

        return deleteResult;
    }

    /*
        shop_order_ids:[
            {
                shopId,
                item_products:[
                    {
                        quantity,
                        old_quant
                    }   
                ]
            }
        ]
    */
    static async getListUserCart({userId}) {
        return await cart.findOne({
            cart_userId:convertoObjectId(userId)
        }).lean()
    }
    static async updateCart({userId , shop_order_ids} ){
       const {productId , quantity ,old_quantity} = shop_order_ids[0]?.item_products[0]
       const foundProduct = await getProductById(productId)
       if(!foundProduct) throw new NotFound('Product not found')
       if(!foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
        throw new NotFound('Product do not belong to the shop')
       }
       if(quantity === 0) {
            return await CartService.deleteItemInCart({userId , productId})
       }
       return await CartService.updateCartQuantity({
        userId , 
        product:{
            productId,
            quantity:quantity - old_quantity
        }
       })
    }


}
module.exports = CartService