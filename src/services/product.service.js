const { BadRequestError, ForbiddenError } = require('../core/error.response');
const { product , electronic , clothing, funiture } = require('../models/product.model')

const {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishsForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProduct,
    findProduct
} = require('../repository/product_repo')

class ProductFactory {
    static productRegisTry = {}

    static registerProductType(type , classRef){
        ProductFactory.productRegisTry[type] = classRef
    }


    static async createProduct(type,payload) {
        const productClass = ProductFactory.productRegisTry[type]
        if(!productClass) throw new BadRequestError('Invalid type')
        return new productClass(payload).createProduct()
       
    }
    static async findAllDraftsForShop ({product_shop , limit = 50 , skip = 0 }){
        const query = {product_shop , isDraft:true}
        return await findAllDraftsForShop({query,limit,skip})
    }
    static async findAllPublishForShop ({product_shop , limit = 50 , skip = 0 }){
        const query = {product_shop , isPublished:true}
        return await findAllPublishsForShop({query,limit,skip})
    }
    static async publishProductByShop({product_shop ,product_id}){
        return await publishProductByShop({product_shop ,product_id})

    }
    static async unPublishProductByShop({product_shop ,product_id}){
        return await unPublishProductByShop({product_shop ,product_id})

    }
    static async searchProductByUser({keySearch}){
        return await searchProductByUser({keySearch})
    }
    static async findAllProduct({ limit = 50 ,sort = 'ctime' , page = 1 , filter={isPublished:true}}){
        return await findAllProduct({limit , sort , page , filter , select :['product_name','product_price','product_thumb']})
    }
    static async findProduct({product_id}){
        return await findProduct({product_id , unSelect:['__v' ,'product_variations']})
    }
}
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_type,
        product_shop,
        product_attributes,
        product_quantity
    }){
        this.product_name = product_name,
        this.product_thumb = product_thumb,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes,
        this.product_quantity = product_quantity
    }
    async createProduct(product_id){
        return await product.create({...this , _id:product_id})
    }
}
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop:this.product_shop
        });
        if(!newClothing) throw new BadRequestError('create new clothing error');
        const newProduct = await super.createProduct();
        if(!newProduct) throw new BadRequestError('create new product error');
        return newProduct;
    }
}
class Electronics extends Product {
    async createProduct() {
        const newClothing = await electronic.create({
            ...this.product_attributes,
            product_shop:this.product_shop
        });
        if(!newClothing) throw new BadRequestError('create new electronic error');
        const newProduct = await super.createProduct(newClothing._id);
        if(!newProduct) throw new BadRequestError('create new product error');
        return newProduct;
    }
}

class Funiture extends Product {
    async createProduct() {
        const newClothing = await funiture.create({
            ...this.product_attributes,
            product_shop:this.product_shop
        });
        if(!newClothing) throw new BadRequestError('create new funiture error');
        const newProduct = await super.createProduct(newClothing._id);
        if(!newProduct) throw new BadRequestError('create new product error');
        return newProduct;
    }
}
ProductFactory.registerProductType('Electronics',Electronics)
ProductFactory.registerProductType('Clothing',Clothing)
ProductFactory.registerProductType('Funiture',Funiture)
module.exports = ProductFactory;