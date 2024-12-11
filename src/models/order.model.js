const {Schema , model}= require('mongoose'); // Erase if already required


const DOCUMENT_NAME ='Order'
const COLLECTION_NAME ='Orders'
// Declare the Schema of the Mongo model
const orderSchema = new Schema({
   order_userId:{type:Number,required:true},
   order_checkout:{type:Object,default:{}},
   order_shipping:{type:Object,default:{}},
   order_payment:{type:Object,default:{}},
   order_products:{type:Array,required:true},
   order_trackingNumber:{type:String,default:'#0000118052022'},
   order_statuc:{type:String , enum:['pending','confirmed','shipped','cancelled','delivered'],default:'pending'},
   

},
    {
        timestamps:{
            createdAt:'createdOn',
            updatedAt:'modifiedOn',
        },
        collection:COLLECTION_NAME
    }
);

//Export the model
module.exports = {
    order:model(DOCUMENT_NAME,orderSchema)
};