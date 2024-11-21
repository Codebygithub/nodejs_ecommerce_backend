'use strict';
const {BadRequestError, NotFound} = require('../core/error.response')
const discount = require('../models/discount.model');
const { findAllDiscountCodeUnSelect, checkDiscountExist } = require('../repository/discount_repo');
const { findAllProduct } = require('../repository/product_repo');
const { convertoObjectId } = require('../utils');
class DiscountService {

    static async createDiscount(payload) {
        const {
            code ,
             start_date,
              end_date ,
              is_active, 
              shopId ,
              min_order_value,
               product_ids,
               applies_to,name,
               description,type,
               value,max_value,max_uses
            ,uses_count,max_uses_per_user,
            users_used
        } = payload;
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount has expired')
        }
        if(new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end date')

        }
        const foundDiscount = await discount.findOne({
            discount_code:code ,
            discount_shopId: convertoObjectId(shopId)
        }).lean()
        if(foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount Exists')
        } 
        const newDiscount = discount.create({
            discount_name:name , 
            discount_description:description , 
            discount_type:type , 
            discount_code:code , 
            discount_value:value , 
            discount_min_order_value:min_order_value || 0  , 
            discount_max_value:max_value , 
            discount_start_date:new Date(start_date) , 
            discount_end_Date:new Date(end_date), 
            discount_max_uses: max_uses , 
            discount_users_count:uses_count , 
            discount_users_used:users_used, 
            discount_shopId:shopId , 
            discount_max_uses_per_user:max_uses_per_user , 
            discount_is_active:is_active ,  
            discount_applies_to:applies_to , 
            discount_product_ids:applies_to === 'all' ? [] : product_ids  , 
            
        })
        return newDiscount


    }
    static async updateDiscount(id , payload) {
        const {
            name,
            description,
            type,
            value,
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
            users_used,
        } = payload;

        const existsDiscount = await discount.findById(id);
        if(!existsDiscount) throw new BadRequestError('Discount not found')
        if(existsDiscount.discount_shopId.toString() !== shopId) throw new BadRequestError('Shop ID does not match ')
        if(start_date && end_date) {
            if(new Date(start_date) >= new Date(end_date)) {
                throw new BadRequestError('Start date must be before end date')
                
            }
        }
        if(code) {
            const foundDiscount = await discount.findOne({
                discount_code:code ,
                discount_shopId: convertoObjectId(shopId),
                _id:{$ne:id}
            }).lean()
            if(foundDiscount && foundDiscount.discount_is_active) {
                throw new BadRequestError('Discount code already exists')
            }
        }
        const updatedDiscount = await discount.findByIdAndUpdate(
            id,
            {
                ...(name && { discount_name: name }),
                ...(description && { discount_description: description }),
                ...(type && { discount_type: type }),
                ...(value && { discount_value: value }),
                ...(code && { discount_code: code }),
                ...(start_date && { discount_start_date: new Date(start_date) }),
                ...(end_date && { discount_end_Date: new Date(end_date) }),
                ...(is_active !== undefined && { discount_is_active: is_active }),
                ...(min_order_value && { discount_min_order_value: min_order_value }),
                ...(max_value && { discount_max_value: max_value }),
                ...(max_uses && { discount_max_uses: max_uses }),
                ...(uses_count && { discount_users_count: uses_count }),
                ...(users_used && { discount_users_used: users_used }),
                ...(max_uses_per_user && { discount_max_uses_per_user: max_uses_per_user }),
                ...(applies_to && { discount_applies_to: applies_to }),
                ...(product_ids && applies_to === "specific" && { discount_product_ids: product_ids }),
            },
            { new: true } 
        );
    
        return updatedDiscount;
        
    }
    static async getAllDiscountCodeWithProduct({
        code , shopId , userId , limit , page  
    }){ 
        const foundDiscount = await discount.findOne({
            discount_code:code ,
            discount_shopId: convertoObjectId(shopId)
        }).lean()
        if(!foundDiscount || foundDisCount.discount_is_active) {
            throw new NotFound('Discount not found')
        } 
        const {discount_applies_to , discount_product_ids} = foundDiscount
        let product
        if(discount_applies_to == 'all') {
            product = await findAllProduct({
                filter:{
                    product_shop:convertoObjectId(shopId),
                    isPublished:true
                },
                limit:+limit,
                page:+page,
                sort:'ctime',
                select:['product_name']
            })
        }
        if(discount_applies_to == 'specific') {
            product = await findAllProduct({
                filter:{
                    _id:discount_product_ids,
                    isPublished:true
                },
                limit:+limit,
                page:+page,
                sort:'ctime',
                select:['product_name']
            })
        }
        return product;
    }
    static async  getAllDiscountCodesByShop({limit , page , shopId}) {
        const discounts  = await findAllDiscountCodeUnSelect({
            limit:+limit,
            page:+page,
            filter :{
                discount_shopId:convertoObjectId(shopId),
                discount_is_active :true
            },
            unSelect :['__v' ,'discount_shopId'],
            model:discount
        })
        return discounts
    }
    static async getDiscountAmount({codeId,userId,shopId,products}) {
        const foundDisCount = await checkDiscountExist({
            model:discount,
            filter:{
                discount_code:codeId,
                discount_shopId:convertoObjectId(shopId),
            }

       })
       if(!foundDiscount ) throw new NotFound('Discount not found')
       const {discount_is_active , discount_max_uses , discount_min_order_value,discount_max_uses_per_user}  = foundDiscount
       if(discount_is_active) throw new NotFound('Discount expired')
       if(discount_max_uses ) throw new NotFound('Discount are out')
       if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)){
        throw new NotFound('Discount code expired')
       }
       let totalOrder = 0 ;
       if(discount_min_order_value > 0 ) {
        totalOrder = products.reduce((acc,product)=>{
            return acc + (product.quantity * product.price)
        },0)
        if(totalOrder < discount_min_order_value) throw new NotFound('Discount required a min order value')
       }
       if(discount_max_uses_per_user > 0 ) {
        const userUserDiscount = discount_users_count.find(user =>user.userId === userId)
        if(userUserDiscount) {
            if(userUserDiscount.uses_count  >= discount_max_uses_per_user) {
                throw new NotFound('User has exceeded the maximum allowed uses for this discount');
            }
            userUserDiscount.uses_count += 1 
       } 
       else {
        foundDisCount.discount_users_used.push({userId,uses:1})
       }
       const amount = discount_type === 'fixed_amount' ?discount_value : totalOrder *(discount_value/100)
       foundDisCount.discount_users_count += 1
       await foundDisCount.save();
       return {
        totalOrder , 
        discount:amount,
        totalPrice :totalOrder - amount
       }
    }

    }
    static async deleteDiscountCode({shopId , codeId}){
        const deleteDiscount  = await discount.findOneAndDelete({
            discount_code:codeId,
            discount_shopId:convertoObjectId(shopId)
        })
        return deleteDiscount
    }
    static async cancelDiscountCode({codeId,shopId,userId}){
        const foundDisCount = await checkDiscountExist({
            model:discount ,
            filter:{
                discount_code:codeId,
                discount_shopId:convertoObjectId(shopId)
            }
        })
        if(!foundDisCount) throw new NotFound('Discount code not found')
        const rs = await discount.findByIdAndUpdate(foundDisCount,{
            $pull:{
                discount_users_used:userId
            }, 
            $inc:{
                discount_max_uses:1,
                discount_users_count:-1
            }
        })
        return rs;
        
    }
}
module.exports = DiscountService