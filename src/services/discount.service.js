'use strict';

const {BadRequestError, NotFound} = require('../core/error.response')
const {discount} = require('../models/discount.model')
const {convertoObjectId, remmoveUndefinedObject, updateNestedObjectParser} = require('../utils');
const { findAllProduct } = require('../repository/product_repo');
const {findAllDiscountCodesUnSelect , findAllDiscountCodesSelect , checkDiscountExists} = require('../repository/discount_repo')
class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
            users_used
        } = payload
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date))
            throw new BadRequestError('Invalid start date or end date')
        if(new Date(start_date) > new Date(end_date)) throw  new BadRequestError('Invalid start date or end date')
        const foundDiscount = await discount.findOne({
            discount_code:code,
            discount_shopId:convertoObjectId(shopId)
        }).lean()
        
        if(foundDiscount && foundDiscount.discount_is_active)  throw new BadRequestError('Discount has already been used')
        const newDiscount = await discount.create({
            discount_name:name,
            discount_description:description,
            discount_code:code,
            discount_value:value,
            discount_min_order_value:min_order_value || 0,
            discount_max_value:max_value,
            discount_start_date:new Date(start_date),
            discount_end_date:new Date(end_date),
            discount_max_uses:max_uses,
            discount_uses_count:uses_count,
            discount_users_used:users_used,
            discount_type:type,
            discount_shopId:shopId,
            discount_max_uses_per_users:max_uses_per_user,
            discount_is_active:is_active,
            discount_applies_to:applies_to,
            discount_product_ids:applies_to === 'all' ? [] : product_ids


        })
        return newDiscount



    }
    static async updateDiscount(discountId , payload) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
        } = payload
        if(start_date && end_date)  
            if(new Date(start_date) > new Date(end_date))
                throw new BadRequestError('Invalid start date or end date')
        if(code) {
            const foundDiscount = await discount.findOne({
                discount_code:code,
                discount_shopId:convertoObjectId(shopId),
                _id:{$ne:discountId}
            }).lean();
            if(foundDiscount && foundDiscount.discount_is_active) {
                throw new BadRequestError('Discount code already exists and is active');
            }
        }
        let updateData = {
            ...(name && { discount_name: name }),
            ...(description && { discount_description: description }),
            ...(code && { discount_code: code }),
            ...(value && { discount_value: value }),
            ...(min_order_value !== undefined && { discount_min_order_value: min_order_value }),
            ...(max_value && { discount_max_value: max_value }),
            ...(start_date && { discount_start_date: new Date(start_date) }),
            ...(end_date && { discount_end_date: new Date(end_date) }),
            ...(max_uses && { discount_max_uses: max_uses }),
            ...(max_uses_per_user && { discount_max_uses_per_user: max_uses_per_user }),
            ...(is_active !== undefined && { discount_is_active: is_active }),
            ...(applies_to && { discount_applies_to: applies_to }),
            ...(applies_to === 'specific' && product_ids && { discount_product_ids: product_ids }),
        };
        updateData = remmoveUndefinedObject(updateData)
        updateData = updateNestedObjectParser(updateData)
        const updateDiscount = await discount.findByIdAndUpdate(
            discountId,
            updateData,
            {new:true, runValidators:true}
        )
        if(!updateDiscount) throw new BadRequestError('Discount not found')
        return updateDiscount;

    }
    static async getAllDiscountCodesWithProduct({ code, shopId, userId, limit, page }) {
        console.log('Received query:', { code, shopId, limit, page });
    
        // Tìm discount trong database
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertoObjectId(shopId),
        }).lean();
    
        console.log('Found Discount:', foundDiscount);
    
        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFound('Discount does not exist or is inactive');
        }
    
        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;
    
        // Nếu áp dụng cho tất cả sản phẩm
        if (discount_applies_to === 'all') {
            products = await findAllProduct({
                filter: {
                    product_shop: convertoObjectId(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name'],
            });
        }
    
        // Nếu áp dụng cho sản phẩm cụ thể
        if (discount_applies_to === 'specific') {
            const productIds = discount_product_ids.map(id => convertoObjectId(id))
            products = await findAllProduct({
                filter: {
                    _id: { $in: productIds },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name'],
            });
        }
    
        console.log('Found Products:', products);
    
        if (!products || products.length === 0) {
            throw new NotFound('No products found for the given discount');
        }
    
        return products;
    }
    
    static async getAllDiscountCodesByShop({
        limit , page , shopId
    }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit:+limit ,
            page:+page,
            filter:{
                discount_shopId:convertoObjectId(shopId),
                discount_is_active:true
            },
            unSelect:['__v','discount_shopId'],
            model:discount
        })
        return discounts
    }
    static async getDiscountAmount({
        codeId,userId,shopId,products
    }) {
        const foundDiscount = await checkDiscountExists({
            model:discount,
            filter:{
                discount_code:codeId,
                discount_shopId:convertoObjectId(shopId),
            }
        })
        if(!foundDiscount) throw new NotFound(` discount not found: ${discount_code}`)
        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value
            ,
        } = foundDiscount
        if(!discount_is_active)  throw new NotFound(` discount is active`)
        if(!discount_max_uses)  throw new NotFound(` discount max uses`)
        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date) ) throw new NotFound(` discount date `)
        let totalOrder
        if(discount_min_order_value > 0 )
        {
            totalOrder= products.reduce((acc,product) => {
                return acc +(product.quantity * product.price) 
            },0)
            if(totalOrder < discount_min_order_value) 
            {
                throw new BadRequestError('Discount required a minimum price order')
            }
        }
        if(discount_max_uses_per_user > 0 ) {
            const userUserDiscount  = discount_users_used.find(user => user.userId === userId)
            if(userUserDiscount.discount_users_used > discount.max_uses_per_user) throw new BadRequestError('Over')
            else {
                userUserDiscount.discount_users_used+=1
                
           }
            
        }
        else {
            discount_users_used.push({userId})
        }
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder=(discount_value/100)
        return {
            totalOrder,
            discount:amount,
            totalPrice:totalOrder - amount
        }
    }
    static async deleteDiscountCode({shopId , codeId}) {
        const deleted = await discount.findOneAndDelete({
            discount_code:codeId,
            discount_shopId:convertoObjectId(shopId)
        })
        if(!deleted) throw new NotFound('Discount not found')
        return {
            success:true,
            message:"success delete discount",
            deleteDiscount:deleted
        }
    }
    static async cancelDiscountCode({codeId,shopId,userId}){
        const foundDiscount = await discount.findOne({
            discount_code:codeId,
            discount_shopId:convertoObjectId(shopId),
        })
        if(!foundDiscount) throw new NotFound('Discount not found')
        const rs = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull:{
                discount_users_used:userId
            },
            $inc:{
                discount_max_uses:1,
                discount_uses_count:-1
            }

        }
        )
        return rs;
    
    }
}

module.exports = DiscountService