const {Schema ,Types, model}= require('mongoose'); // Erase if already required


const DOCUMENT_NAME ='Inventory'
const COLLECTION_NAME ='Inventories'
// Declare the Schema of the Mongo model
const inventorySchema = new Schema({
   inven_productId:{type:Schema.Types.ObjectId,ref:'Product'},
   inven_localtion:{type:String ,default:"unknown"},
   inven_stock:{type:Number , required:true},
   inven_shopIid:{type:Schema.Types.ObjectId,ref:'Shop'},
   inven_reservations:{type:Array,default:[]}
},
    {
        timestamps:{
            createdAt:'createdOn',
            updatedAt:'modifiedOn'
        },
        collection:COLLECTION_NAME
    }
);

//Export the model
module.exports ={
    inventory:model(DOCUMENT_NAME, inventorySchema)
} 