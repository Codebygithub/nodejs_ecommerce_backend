
'use strict'
const slugify = require('slugify')
const {model , Schema , Types} = require('mongoose')
const { inventory } = require('./inventory.model')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const ProductSchema = new Schema({
    product_name:{type: String, required: true},
    product_thumb:{type: String, required: true},
    product_description:String ,
    product_slug :String,
    product_price:{type:Number , required: true},
    product_quantity:{type:Number, required: true},
    product_type:{type:String, required: true,enum:['Electronics','Clothing','Furniture']},
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'} ,
    product_attributes:{type:Schema.Types.Mixed ,required:true},
    product_ratingsAverage :{ 
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be above 5.0'],
        set:(val) => Math.round(val *10)/10
    },
    product_variations :{
        type:Array,default:[]
    },
    isDraft :{type:Boolean , default:true , index:true,select:false},
    isPublished :{type:Boolean , default:false , index:true,select:false},
},
   
    {
        timestamps:true ,
        collection:COLLECTION_NAME
    }
)
ProductSchema.index({product_name:'text',product_description:'text'})
ProductSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name ,{lower:true})
    next();
})
ProductSchema.pre('save',async function(next) {
    if(this.isNew) {
        const newInventory = new inventory({
            inven_productId :this._id,
            inven_stock:this.product_quantity,
            inven_shopId:this.product_shop,
            inven_localtion:'unknown'
        })
        await newInventory.save()
    }
    next();
})
const clothesSchema = new Schema({
    brand:{type:String , require:true},
    size:String,
    material:String,
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'} ,
    

},{
    collection:'clothes',
    timestamps:true
})

const electronicSchema = new Schema({
    manufacturer:{type:String , require:true},
    model:String,
    color:String,
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'} ,

},{
    collection:'electronics',
    timestamps:true
})

const funitureSchema = new Schema({
    manufacturer:{type:String , require:true},
    model:String,
    color:String,
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'} ,

},{
    collection:'funitures',
    timestamps:true
})

module.exports = {
    product:model(DOCUMENT_NAME , ProductSchema),
    clothing:model('clothing' , clothesSchema),
    electronic:model('electronics' ,electronicSchema),
    funiture:model('funitures' ,funitureSchema)
}

