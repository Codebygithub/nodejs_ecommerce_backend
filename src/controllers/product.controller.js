const ProductService = require('../services/product.service')
const { Created } = require("../core/success.response");


class ProductController {

    ///POST
    createProduct = async(req,res,next) =>{
        new Created({
            message: 'Create Product Successfully',
            
            metadata: await ProductService.createProduct(req.body.product_type,{
                ...req.body,
                product_shop:req.user.userId
            })
        }).send(res)

        
    }
    publishProductByShop = async(req,res,next) =>{
        new Created({
            message: 'publishProductByShop Successfully',
            
            metadata: await ProductService.publishProductByShop({
                product_id: req.params,
                product_shop:req.user.userId
            })
        }).send(res) 

    
        
        
        
    }
    unPublishProductByShop = async (req,res,next) => {
        new Created({
            message: 'unPublishProductByShop Successfully',
            
            metadata: await ProductService.unPublishProductByShop({
                product_id: req.params,
                product_shop:req.user.userId
            })
        }).send(res) 
    }
  
    ///END POST
 /**
     * @desc get all drafts for shop
     * @param {Number} limit 
     * @param {Number} skip 
     * @return {JSON}
     */

////QUERY

searchProductByUser = async (req,res,next) => {
    new Created({
        message: 'searchProductByUser Successfully',
        
        metadata: await ProductService.searchProductByUser(
            req.params
        )
    }).send(res) 
}
getAllDraftsForShop = async(req,res,next) => {
    new Created({
        message: 'getAllDraftsForShop Successfully',
        metadata: await ProductService.findAllDraftsForShop({
                product_shop:req.user.userId
            })
        }).send(res)
    }
    getAllPublishForShop = async(req,res,next) => {
        new Created({
            message: 'getAllPublishForShop Successfully',
            metadata: await ProductService.findAllPublishForShop({
                product_shop:req.user.userId
            })
        }).send(res)
    }
    ///END QUERY
}
module.exports = new ProductController