'use strict'
const { NotFound, BadRequestError } = require('../core/error.response');
const {cart}= require('../models/cart.model');
const { inventory } = require('../models/inventory.model');
const {convertoObjectId} = require('../utils')
const {getProductById} = require('../repository/product_repo')

class CartService {


    static async updateCart({ userId, product }) {
        const {productId , quantity} = product
        const query = {
            cart_userId:userId,
            'cart_products.productId':productId,
            cart_state:'active'
        },updateSet = {
            $inc:{
                'cart_products.$.quantity':quantity
            }
        },options = {upsert:true , new :true}
        return await cart.findOneAndUpdate(query , updateSet , options)
    }

    static async createCart({ userId, product }) {
        const query = {cart_userId:userId , cart_state:'active'},
        updateOrInsert = {
            $addToSet:{
                cart_products:product
            }
        },options = {upsert:true , new:true}
        return await cart.findOneAndUpdate(query, updateOrInsert,options)
    }
    // static async deleteCart({userId, productId}) {
    //     const query = {cart_userId:userId , cart_state :'active'}
    //     updateCart = {
    //         $pull:{
    //             cart_products:{
    //                 productId
    //             }
    //         }
    //     }
    //     const deletedCart = await cart.updateOne(query , updateCart)
    //     return deletedCart
    // }

    // static async addToCart({userId,product = {}}){
    //     const foundCart = await cart.findOne({
    //         cart_userId:userId
    //     })
    //     if(!foundCart){
    //         return await CartService.createCart({userId,product})
    //     }
    //     if(!foundCart.cart_products.length) {
    //         foundCart.cart_products =[product]
    //         return await foundCart.save()
    //     }
    //     return await CartService.updateCart({userId,product})
    // }
    static async addtoCart({userId ,product = {}}) {
       const {productId , quantity} = product
       if (!productId || quantity === undefined) throw new Error('Product ID and quantity are required');
       const foundInventory = await inventory.findOne({inven_productId :productId})
       if(!foundInventory) throw new NotFound('Product Inventory not found')
       if(quantity > 0 && foundInventory.inven_stock < quantity) throw new BadRequestError(`Insufficient stock. Only ${inventory.inven_stock} items are available`)
       let foundCart = await cart.findOne({cart_userId:userId , cart_state:'active'})
       if(!foundCart) {
        foundCart = await this.createCart({userId , product})
       }
       if(quantity > 0 ) {
        const updateCart = await this.updateCart({userId:foundCart , product})
        if(!updateCart.success) {
            throw new BadRequestError(updateCart.message)
        }
        foundInventory.inven_stock = quantity

       }
       else if(quantity === 0 ) {
        await this.deleteItemInCart({userId , productId})
        const existingInventory = foundCart.cart_count_product.find((p)=>p.productId.toString() === productId)
        if(existingInventory) foundInventory.inven_stock += existingInventory.quantity
       }
       await foundInventory.save()
       return foundCart;

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
    static async getListUserCart({userId}) {
        return await cart.findOne({
            cart_userId:convertoObjectId(userId)
        }).lean()
    }


}
module.exports = CartService