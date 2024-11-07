'use strict' 


'use strict'

const {model , Schema , Types} = require('mongoose')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const ProductSchema = new Schema({
    product_name:{type: String, required: true},
    product_thumb:{type: String, required: true},
    product_description:String ,
    product_price:{type:Number , required: true},
    product_quantity:{type:Number, required: true},
    product_type:{type:String, required: true,enum:['Electronics','Clothing','Furniture']},
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'} ,
    product_attributes:{type:Schema.Types.Mixed ,required:true},
},
   
    {
        timestamps:true ,
        collection:COLLECTION_NAME
    }
)
const clothesSchema = new Schema({
    brand:{type:String , require:true},
    size:String,
    material:String
},{
    collection:'clothes',
    timestamps:true
})

const electronicSchema = new Schema({
    manufacturer:{type:String , require:true},
    model:String,
    color:String
},{
    collection:'electronics',
    timestamps:true
})

module.exports = {
    product:model(DOCUMENT_NAME , ProductSchema),
    clothing:model('clothing' , clothesSchema),
    electronic:model('electronics' ,electronicSchema)
}

