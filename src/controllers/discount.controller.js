const DiscountService = require('../services/discount.service')
const { Created } = require("../core/success.response");
const { NotFound } = require('../core/error.response');


class DiscountController {

    ///POST
    createDiscount= async(req,res,next) =>{
        new Created({
            message: 'Create Product Successfully',
            
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId:req.user.userId
            })
        }).send(res)

        
    }

    updateDiscount = async(req,res,next) =>{
        const discountId = req.params.discountId
        const shopId = req.user.userId
        const updateDate = {...req.body,shopId}
        new Created({
            message: 'update Discount Successfully',
            metadata: await DiscountService.updateDiscount(discountId , updateDate)
        }).send(res)
    }
    deleteDiscount = async(req,res,next)=>{
        const {shopId} = req.body 
        const {codeId} = req.params
        new Created({
            message: 'delete Discount Successfully',
            metadata: await DiscountService.deleteDiscountCode({shopId,codeId})
        }).send(res)
    }
    getAllDiscountCodes = async(req,res,next)=>{
        new Created({
            message: ' Successfully code found',
            metadata: await DiscountService.getAllDiscountCodesByShop({...req.query,shopId:req.user.userId})
        }).send(res)
    }
    getDiscountAmount = async(req,res,next)=>{
        new Created({
            message: ' Successfully code found',
            metadata: await DiscountService.getDiscountAmount({...req.body})
        }).send(res)
    }
    getAllDiscountCodesWithProduct = async(req,res,next)=>{
        const metadata = await DiscountService.getAllDiscountCodesWithProduct({...req.query})
        if(!metadata || metadata.length ===0) throw new NotFound('No products found for the given discount code');
        new Created({
            message: ' Successfully code found',
            metadata
        }).send(res)
        
    }
    getAllDiscountCodesByShop = async(req,res,next)=>{
        const metadata = await DiscountService.getAllDiscountCodesByShop({...req.query})
        if(!metadata || metadata.length ===0) throw new NotFound('No products found for the given discount code');
        new Created({
            message: ' Successfully code found',
            metadata
        }).send(res)
    }
    ///END QUERY
}
module.exports = new DiscountController