const {Schema , model}= require('mongoose'); // Erase if already required


const DOCUMENT_NAME ='Discount'
const COLLECTION_NAME ='discounts'
// Declare the Schema of the Mongo model
const discountSchema = new Schema({
    discount_name:{type:String,required:true},
    discount_description:{type:String,required:true},
    discount_type:{type:String,default:'fixed_amount'},
    discount_value:{type:Number,required:true},
    discount_code:{type:String,required:true},
    discount_start_date:{type:Date,required:true},
    discount_end_Date:{type:Date,required:true},
    discount_max_uses:{type:Number,required:true},
    discount_users_count:{type:Number,required:true},
    discount_users_used:{type:Array,default:[]},
    discount_max_uses_per_user:{type:Number,required:true},
    discount_min_order_value:{type:Number,required:true},
    discount_shopId:{type:Schema.Types.ObjectId,required:true},
    discont_is_active:{type:Boolean,default:true},
    discount_applies_to:{type:String,required:true,enum:['all','specific']},
    discount_product_ids:{type:Array,default:[]}
},
    {
        timestamps:true,
        collection:COLLECTION_NAME
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);