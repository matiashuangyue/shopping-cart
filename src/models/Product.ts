import mongoose, { Schema,model } from "mongoose";

const SchemaProducts= new Schema({
    Id:{type:Number,required : true},
    Name:{type:String,required : true},
    Description:{type:String,required:true},
    Cant:{type:Number,required:true},
    Price:{type:Number,required:true},
    InCart:{type:Boolean,default:false}
})

const ProductModel = model("Product",SchemaProducts)

export default ProductModel
