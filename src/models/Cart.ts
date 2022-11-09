import { Schema,model } from "mongoose";

const SchemaCart =new Schema({
    NameCart:{type:String,required:true,unique:true},
    Detalle:{type:Array},
    Price:{type:Number,required:true}
})

const CartModel = model("Cart",SchemaCart)

export default CartModel