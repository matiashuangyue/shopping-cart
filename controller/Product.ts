import ProductModel from "../src/models/Product";
import {Request,Response}from "express"

const productController ={
    get:async(req:Request,res:Response)=>{
        try{ //encontrar todos los productos
            const FindAllProduct=await ProductModel.find()
            res.status(200).send(FindAllProduct)
        }catch(error){
            res.status(500).send(error)
        }
    },

    add:async(req:Request ,res:Response)=>{
        try 
        { //para agregar productos 
            const existeProductos = await ProductModel.findOne({Name: req.body.Name})
            if(existeProductos){
                res.status(400).send(`El producto ${existeProductos.Name} ya se encuentra en la base de datos`)
            }else
            {
                const addProduct = new ProductModel({... req.body})
                if(addProduct.Cant > 0 && addProduct.Name != "" && addProduct.Price >= 0)
                {
                await addProduct.save()
                res.status(200).send(addProduct)
                }else
                {
                    res.status(400).send(`* La cantidad de productos que se desea agregar no puede ser de 0 ni inferior a este\n* Tampoco puede tener un nombre de caracter vacio\n* Los precios deben ser superior o igual a 0`);
                }                           
            }         
        }catch(error){
            res.status(500).send(error)
        }
    },

    delete:async(req:Request ,res:Response)=>{
        try {//borra con id de producto 
            const id = req.params.id
            const FindProduct = await ProductModel.findOne({... req.params})
            if(FindProduct?.Id != undefined || FindProduct?.Id != null){
                const product = await ProductModel.findOneAndDelete({... req.params});
                res.status(200).send(`Se elimino ${product?.Id} y sus respectivos valores de la base de datos.`);
            }
            else
            {
                res.status(404).send(`El producto ${req.params.Id} no existe en la base de datos .`)             
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
}
export default productController