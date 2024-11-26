'use strict'
const {cart}= require('../models/cart.model')

class CartService {


    static async updateCart({ userCart, product }) {
        try {
            const products = JSON.parse(userCart.cart_products);

            const productIndex = products.findIndex(
                (item) => item.productId === product.productId
            );

            if (productIndex >= 0) {
                // Nếu sản phẩm đã tồn tại, tăng số lượng
                products[productIndex].quantity += 1;
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm mới
                products.push({ ...product, quantity: 1 });
            }

            // Cập nhật giỏ hàng
            userCart.cart_products = JSON.stringify(products);
            userCart.cart_count_product = products.reduce(
                (count, item) => count + item.quantity,
                0
            ); // Tổng số lượng sản phẩm
            await userCart.save();

            return {
                success: true,
                message: 'Cart updated successfully!',
                cart: userCart,
            };
        } catch (error) {
            console.error('Error in CartService.updateCart:', error);
            throw new Error('Failed to update cart.');
        }
    }

    static async createCart({ userId, product }) {
        try {
            const newCart = await cart.create({
                cart_userId: userId,
                cart_products: JSON.stringify([{ ...product, quantity: 1 }]), // Sản phẩm đầu tiên
                cart_count_product: 1, // Số lượng ban đầu
            });

            return {
                success: true,
                message: 'Cart created successfully!',
                cart: newCart,
            };
        } catch (error) {
            console.error('Error in CartService.createCart:', error);
            throw new Error('Failed to create cart.');
        }
    }
    static async deleteCart({userId, productId}) {
        const query = {cart_userId:userId , cart_state :'active'}
        updateCart = {
            $pull:{
                cart_products:{
                    productId
                }
            }
        }
        const deletedCart = await cart.updateOne(query , updateCart)
        return deletedCart
    }

    static async addToCart({userId,product = {}}){
        const foundCart = await cart.findOne({
            cart_userId:userId
        })
        if(!foundCart){
            return await CartService.createCart({userId,product})
        }
        if(!foundCart.cart_products.length) {
            foundCart.cart_products =[product]
            return await foundCart.save()
        }
        return await CartService.updateCart({userId,product})
    }


}
module.exports = CartService