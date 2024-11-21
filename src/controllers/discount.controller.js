'use strict';

const { Created } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
   createDiscount = async (req, res,next) => {
        new Created({
                message: 'Success Create Discount',
                metadata: await DiscountService.createDiscount({
                    ...req.body,
                    shopId:req.user.userId
                })
        }).send(res)

   }
   getAllDiscountCodes = async(req,res,next) =>{
    new Created({
        message: 'Success get all  Discount',
        metadata: await DiscountService.getAllDiscountCodesByShop({
            ...req.query,
            shopId:req.user.userId
        })
    }).send(res)
   }
   getDiscountAmount = async(req,res,next) =>{
    new Created({
        message: 'Success get all  Discount',
        metadata: await DiscountService.getDiscountAmount({
            ...req.body
        })
    }).send(res)
   }
   getAllDiscountCodesWithProduct = async(req,res,next) =>{
    new Created({
        message: 'Success get all  Discount',
        metadata: await DiscountService.getAllDiscountCodeWithProduct({
            ...req.query
            
        })
    }).send(res)
   }
  
   
}

module.exports = new DiscountController();