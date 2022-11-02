import { Schema,model } from "mongoose";

const SchemaCart =new Schema({
    Name:{type:String,required:true,unique:true},
    Cant:{type:Number, required:true},
    Price:{type:Number}
})

const CartModel = model("Cart",SchemaCart)

export default CartModel