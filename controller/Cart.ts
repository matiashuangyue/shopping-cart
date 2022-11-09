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

    },


    
    
}

export default cartController
/*,

    add: async (req: Request, res: Response) => {
        try
        {
            const buscarProductos = await ProductModel.findOne({Name : req.body.Name});
            if(buscarProductos?.Name != undefined || buscarProductos?.Name != null){
            const OperacionesCART = {Cant: req.body.Cant, Price: buscarProductos.Price}
            if(OperacionesCART.Cant <= buscarProductos.Cant ){
                const TotalPrecio = OperacionesCART.Price * OperacionesCART.Cant;
                const addProducto = new CartModel({Name: buscarProductos?.Name, Cant: req.body.Cant, Price: TotalPrecio}); 
                await addProducto.save();
                const TotalStock = buscarProductos.Cant - OperacionesCART.Cant;
                if(TotalStock == 0)
                {
                    buscarProductos.delete();
                }else{
                    buscarProductos.Cant = TotalStock;
                    buscarProductos.InCart = true;
                    buscarProductos.save();
                }                              
                res.status(200).send(addProducto);
                }else
                {
                    res.status(400).send(`No se puede agregar el producto porque el producto ${buscarProductos.Name} no tiene stock suficiente`);
                }             
            }else{
                res.status(404).send(`El producto ${buscarProductos?.Name} no existe en la base de datos.`)
            }
        }
        catch(error)
        {
            res.status(500).send(error);
        }
        
    },

    
    delete: async (req: Request, res: Response) => {
        try
        {
            const BuscarProducto = await CartModel.findOne({Name: req.params.Name})
            const Productos = await ProductModel.findOne({... req.params})
            if(BuscarProducto?.Name != undefined && Productos?.Name != undefined){
                const StockCarrito = {Cant: BuscarProducto?.Cant}
                const StockProductos = {Cant: Productos?.Cant}
                const TotalStock = StockCarrito.Cant + StockProductos.Cant
                const productoNombre = await CartModel.findOneAndDelete({Name: req.params.Name})
                Productos.Cant = TotalStock;
                Productos.save()
                res.status(200).send(`El producto ${BuscarProducto.Name} se elimino con exito del carrito y \nse devolvió el stock del carrito a la base de datos de Productos`);                
            }else if(BuscarProducto?.Name != undefined && Productos?.Name == undefined && BuscarProducto.Price != undefined) 
            {
                const OperacionesCART = {Cant: BuscarProducto.Cant, Price: BuscarProducto.Price}
                const precioProducto = OperacionesCART.Price / OperacionesCART.Cant;                
                const newProducto = new ProductModel({Name: BuscarProducto.Name, Cant: BuscarProducto.Cant, Price: precioProducto, InCart: false});
                newProducto.save();                
                BuscarProducto.delete();
                res.status(200).send(`El producto ${BuscarProducto.Name} se elimino con exito del carrito y \nse devolvió el stock del carrito a la base de datos de Productos`)
            }else{
                res.status(404).send(`El producto ${req.params.Name} no existe en la base de datos`);
            }
        }
        catch(error)
        {
            res.status(500);
        }
    }*/


