const {Schema , model}= require('mongoose'); // Erase if already required


const DOCUMENT_NAME ='Cart'
const COLLECTION_NAME ='Carts'
// Declare the Schema of the Mongo model
const cartSchema = new Schema({
    cart_state:{
        type:String , required:true , enum:['active','completed' , 'failed' , 'pending'],
        default:'active'
    },
    cart_products:[{
        productId:{type:Schema.Types.ObjectId , ref:'Product'},
        quantity:{type:Number , required:true , default:1}
        
    }],
    cart_count_product:{type:Number , default: 0 },
    cart_userId:{type:Schema.Types.ObjectId  , required:true }
},
    {
        timestamps: {
            createdAt:'createdOn',
            updatedAt:'updatedOn'
        },
        collection:COLLECTION_NAME
    }
);

//Export the model
module.exports =  {
    cart:model(DOCUMENT_NAME, cartSchema)
}