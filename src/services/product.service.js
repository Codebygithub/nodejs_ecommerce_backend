const { BadRequestError } = require('../core/error.response');
const { product , electronic , clothing } = require('../models/product.model')



class ProductFactory {
    static async createProduct(type,payload) {
        switch (type) {
            case 'Electronics' :
                return new Electronics(payload).createProduct()
            case 'Clothing' :
                return new Clothing(payload).createProduct()
        }
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
        const newClothing = await clothing.create(this.product_attributes);
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

module.exports = ProductFactory;