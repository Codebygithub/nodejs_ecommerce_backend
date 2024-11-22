const {Schema ,Types, model}= require('mongoose'); // Erase if already required


const DOCUMENT_NAME ='Discount'
const COLLECTION_NAME ='discounts'
// Declare the Schema of the Mongo model
const inventorySchema = new Schema({
   discount_name:{type:String ,required:true},
   discount_description:{type:String,required:true},
   discount_type:{type:String,default:'fixed_amount'},
   discount_value:{type:Number,required:true},
   discount_code:{type:String,required:true},
   discount_start_date:{type:Date,required:true},
   discount_end_date:{type:Date,required:true},
   discount_max_uses:{type:Number,required:true},//so luong discount dc ap dung
   discount_uses_count:{type:Number,required:true},// user duoc su dung bao nhieu lan
   discount_users_used:{type:Array,default:[]},//nhung nguoi su dung
   discount_max_uses_per_users:{type:Number,required:true},//so luong cho phep toi da duoc su dung
   discount_min_order_value:{type:Number,required:true },//so luong cho phep toi da du
   discount_shopId:{type:Schema.Types.ObjectId,ref:'Shop'},
   discount_is_active:{type:Boolean,required:true},
   discount_applies_to:{type:String,required:true,enum:['all','specific']},
   discount_product_ids:{type:Array,default:[]}



},
    {
        timestamps:true,
        collection:COLLECTION_NAME
    }
);

//Export the model
module.exports ={
    inventory:model(DOCUMENT_NAME, inventorySchema)
} 