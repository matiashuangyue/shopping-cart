import { Request, Response} from "express";
import CartModel from "../src/models/Cart";
import ProductModel from "../src/models/Product";


const cartController ={
    get:async(req:Request,res:Response)=>{
        try{
            const ProducList=await CartModel.find()
            if(ProducList){
                res.status(200).send(ProducList)
            }
            else{
                res.status(400).send("aun no existe carrito")
            }
        }
        catch(error){
            res.status(500).send(error)
        }

    }
}
export default cartController