import e, { Request,Response } from "express";
import DetalleModel from "../src/models/detalles";
import CartModel from "../src/models/Cart";
import ProductModel from "../src/models/Product";
import cartController from "./Cart";

const DetalleController={
    get: async(req:Request, res:Response)=>{
        try 
        {
            const ExisiteCart=await CartModel.find()
            if(ExisiteCart){
                const ProducList = await CartModel.find()
                res.status(200).send(ProducList)
            }
            else{
                CrearCart()
                res.status(200).send("se creo un carrito nuevo")
            }
        }
        catch(error){
            res.status(500).send(error)
        }
    },

    add: async (req: Request, res: Response) => {
        try
        {

            //Producto que se desea agregar, para agregar un producto se deberá escribir desde body
            const FindProduct = await ProductModel.findOne({Name: req.body.NameProduc});//agregar producto con nombre 
            const ExisiteCart = await CartModel.findOne({NameCart: "Cart"})
                                //Consultas mongoose
            if(!ExisiteCart)
            {
                CrearCart();
            }
            
            
            //Revisar si existe el producto antes de agregarlo
            if(FindProduct?.Name && ExisiteCart){
            //OperacionesCART es la cantidad de productos que se quiuere tener ahora y también tendrá el precio que se obtendrá de la base de datos productos
            const OperacionesCART = {Cantidad: req.body.Cant, Precio: FindProduct.Price}
            if(OperacionesCART.Cantidad <= FindProduct.Cant ){
                //Si se cumple la condición, se agregará el producto y se descontará la cantidad de productos del model producto                   
                //La variable TotalPrecio guardará el nuevo precio según la cantidad de productos ingresados
                const TotalPrecio = GetPriceTotal(OperacionesCART.Precio, OperacionesCART.Cantidad);
                //La variable TotalPrecio pondrá el nuevo precio del producto en el carrito
                const addProducto = new DetalleModel({NameProduc: FindProduct?.Name, Cant: req.body.Cant, Price: TotalPrecio}); 
                await addProducto.save();
                //Actualizar productos // La variable TotalStock guardará el stock total que quedo en la base de datos de Productos
                const stockRestante = getstockRestante(OperacionesCART.Cantidad, FindProduct.Cant);
                //carritoLenght obtenemos el tamaño del array
                const carritoLenght = ExisiteCart.Detalle.length
                //Para comprobar sí es 0 el Stock, sí es 0 se borrará el producto de la base de datos
                if(stockRestante == 0)
                {
                    
                    ExisiteCart?.Detalle.push(addProducto)
                    ExisiteCart.Price = getPreciocarritoList(ExisiteCart.Price, TotalPrecio);
                    ExisiteCart.save();
                    FindProduct.delete();
                    
                }else{
                    FindProduct.Cant = stockRestante;
                    FindProduct.save();
                    ExisiteCart?.Detalle.push(addProducto)
                    ExisiteCart.Price = getPreciocarritoList(ExisiteCart.Price, TotalPrecio);
                    ExisiteCart.save();
                }                            
                //COndicionales para subir en array
                res.status(200).send(addProducto);
                }else
                {
                    res.status(400).send(`No se puede agregar el producto porque el producto ${req.body.NameProduc}\nno tiene stock suficiente.`);
                }             
            }else{
                res.status(404).send(`El producto ${req.body.NameProduc} no existe en la base de datos.`)
            //HTTP STATUS NOT FOUND
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
            //Buscar el producto a eliminar del carrito con parametros
            const BuscarProducto = await DetalleModel.findOne({NameProduc: req.params.NameProduc})
            //Antes de eliminarlo creo también una variable que conecta con la base de datos de Producto
            const Productos = await ProductModel.findOne({Name: req.params.NameProduc})
            const ExisiteCart = await CartModel.findOne({NameCart: "Cart"})
            if(!ExisiteCart)
            {
                CrearCart()
            }
            
            //Este if sirve para comprobar si existe el producto deseado y también existe en la base de datos de Producto
            if(BuscarProducto?.NameProduc && Productos?.Name){
            //Creo la variable del producto del carrito que se está por eliminar para devolver el stock en la base de datos de Producto
                const StockCarrito = {Cant: BuscarProducto?.Cant}
                //Guardo el stock que tiene almacenado la base de datos de Producto
                const StockProductos = {Cant: Productos?.Cant}
                //Ahora creo una variable que guardará el stock de ProductoCarrito y sumará ese Stock con el Stock de la base de datos de Producto
                const TotalStock = getCantidadTOTAL(StockCarrito.Cant, StockProductos.Cant);
                const productoNombre = await DetalleModel.findOneAndDelete({NameProduc: req.params.NameProduc})
                //Una vez eliminado la base de datos, se guardará los stock sumados a la base de datos de PRODUCTOS
                Productos.Cant = TotalStock;
                
                if(ExisiteCart && BuscarProducto.Price)
                {
                    //Eliminar valores del array
                    const deleteProductoArray = ExisiteCart.Detalle.filter((BuscarProducto => BuscarProducto.NameProduc != req.params.NameProduc))
                    ExisiteCart.Detalle = deleteProductoArray;
                    ExisiteCart.Price = ExisiteCart.Price - BuscarProducto.Price
                    ExisiteCart.save();
                }
                Productos.save()
                res.status(200).send(`El producto ${BuscarProducto.NameProduc} se elimino con exito del carrito y \nse devolvió el stock del carrito a la base de datos de Productos`);                         
            //Sí esta condiciíon se activa es porque existe el producto en la base de datos Carrito pero no en la base de datos Productos
            }else if(BuscarProducto?.NameProduc && !Productos?.Name && BuscarProducto.Price) 
            {
                //Operaciones Matemáticas para devolver el precio Original
                const OperacionesCART = {Cantidad: BuscarProducto.Cant, Precio: BuscarProducto.Price}
                const precioProducto = GetPrice(OperacionesCART.Precio, OperacionesCART.Cantidad);
                //Volver a crear el producto en la base de datos productos
                const newProducto = new ProductModel({Name: BuscarProducto.NameProduc, Cant: BuscarProducto.Cant, Price: precioProducto});
                newProducto.save();
                //Actualizar array
                if(ExisiteCart)
                {
                    //Eliminar valores del array
                    const deleteProductoArray = ExisiteCart.Detalle.filter((BuscarProducto => BuscarProducto.NameProduc != req.params.NameProduc))
                    ExisiteCart.Detalle = deleteProductoArray;
                    ExisiteCart.Price = ExisiteCart.Price - BuscarProducto.Price
                    ExisiteCart.save();
                }
                //Ahora borrará el producto del carrito y lo devolverá a la base de datos productos
                BuscarProducto.delete();
                res.status(200).send(`El producto ${BuscarProducto.NameProduc} se elimino con exito del carrito y \nse devolvió el stock del carrito a la base de datos de Productos`)
            }else{
                res.status(404).send(`El producto ${req.params.NameProduc} no existe en la base de datos`);
            }
            
        }
        catch(error)
        {
            res.status(500);
        }
    },


    put: async (req: Request, res: Response) => {
        try
        {
            //Se obtendrá el producto de la base de datos del carrito
            const obtenerProductoCART = await DetalleModel.findOne({NameProduc: req.body.NameProduc})
            //Se obtendrá el producto de la base de datos de producto
            const obtenerProducto = await ProductModel.findOne({Name: req.body.NameProduc})
            //El condicional este nos dirá si existen los dos productos en sus respectivas base de datos
            const ExisiteCart = await CartModel.findOne({NameCart: "Cart"})
            if(!ExisiteCart)
            {
                CrearCart();
            }

            if(obtenerProductoCART && obtenerProducto)
            {
                //Obtenemos el cantidadTOTAL
                const stockTOTAL = getCantidadTOTAL(obtenerProductoCART?.Cant, obtenerProducto?.Cant)
                //Obtenemos el precio del producto, no el precio del producto en el carrito 
                const precioProducto = obtenerProducto?.Price;
                //Obtenemos la nueva cantidad que se quiere modificar
                const nuevaCantidad = {Cantidad: req.body.Cant}
                //Obtenemos el stock restante que será devuelto a la base de datos de producto
                const stockRestante = getstockRestante(nuevaCantidad.Cantidad, stockTOTAL)
                 //Crear una variable para guardar el precio antiguo
                const precioCARTAntiguo = obtenerProductoCART.Price;
                //En el siguiente condicional, se comprobará que la cantidad nueva de productos no sea negativa
                //También si el precio del producto del carrito existe y también el precio del producto de la base de datos
                if(stockRestante >= 0 && precioProducto && ExisiteCart && obtenerProductoCART && precioCARTAntiguo)
                {
                    
                 if(nuevaCantidad.Cantidad != 0)
                 {
                    //Sí stock restante es 0 se borrará el producto de la base de datos
                    if(stockRestante == 0)
                    {
                        obtenerProducto?.delete();
                    }else if(obtenerProducto?.Cant != null)
                    {
                        obtenerProducto.Cant = stockRestante
                        obtenerProducto.save();
                    }
                   
                    obtenerProductoCART.Cant = nuevaCantidad.Cantidad
                    obtenerProductoCART.Price = precioProducto * nuevaCantidad.Cantidad;
                    obtenerProductoCART.save();
                    //Actualizar Array
                    const index = ExisiteCart.Detalle.findIndex((producto) => {
                        return producto.NameProduc == obtenerProductoCART.NameProduc
                    });
                    const updateArray = ExisiteCart.Detalle.splice(index, 1)
                    ExisiteCart.Detalle.push(obtenerProductoCART);
                    //Comprobar si existe solo un producto en el carritp
                    ExisiteCart.Price = ExisiteCart.Price + obtenerProductoCART.Price - precioCARTAntiguo 
                    ExisiteCart.save();
                    res.status(200).send(`Se actualizo con exito el producto del carrito:\n* ${req.body.NameProduc}\n* Cantidad: ${nuevaCantidad.Cantidad}\n\n`)
                 }
                 else
                  {
                    if(ExisiteCart && obtenerProductoCART.Price)
                    {
                    //Eliminar valores del array
                       
                    ExisiteCart.Detalle = ExisiteCart.Detalle.filter((producto) => {
                        return producto.NameProduc != obtenerProductoCART.NameProduc
                    })
                    ExisiteCart.Price = ExisiteCart.Price - obtenerProductoCART.Price
                    ExisiteCart.save();
                    }           
                    //Se eliminará el producto del carrito sí la nueva cantidad es 0
                    obtenerProducto.Cant = stockRestante;
                    obtenerProducto.save();
                    obtenerProductoCART.delete();
                    res.status(200).send(`Se elimino el producto del carrito y se envió el stock restante a \nla base de datos de Productos.`)
                  }    
                    
                }else
                {
                    res.status(400).send(`No hay stock suficiente.`);
                }
            } 
            //El condicional este nos dirá si no existe en la base de datos carrito pero si existe el producto en la base de datos de producto     
            if(!obtenerProductoCART && obtenerProducto)
            {
                res.status(400).send(`No se puede actualizar, el producto ${req.body.Nombre_Producto} no existe en el carrito.`)
            }
            // El condicional se activa si existe el producto en el carrito pero no en la base de datos de producto          
            if(obtenerProductoCART && !obtenerProducto)
            {
                //Obtenemos el cantidadTOTAL
                const stockTOTAL = obtenerProductoCART.Cant
                //Obtenemos el precio del producto, no el precio del producto en el carrito 
                const precioProducto = GetPrice(obtenerProductoCART.Price, stockTOTAL)
                //Obtenemos la nueva cantidad que se quiere modificar
                const nuevaCantidad = {Cantidad: req.body.Cantidad}
                //Obtenemos el stock restante que será devuelto a la base de datos de producto
                const stockRestante = getstockRestante(nuevaCantidad.Cantidad, stockTOTAL)
                const precioCARTAntiguo = obtenerProductoCART.Price;
                //En el siguiente condicional, se comprobará que la cantidad nueva de productos no sea negativa ni 0
                //También si el precio del producto del carrito existe y también el precio del producto de la base de datos
                if(stockRestante > 0)
                {
                    //Sí la nueva cantidad es 0, entonces se borrará el producto de la base de datos y se devolverá todo sus valores a la base de datos productos
                    if(nuevaCantidad.Cantidad == 0 && ExisiteCart && obtenerProductoCART.Price)
                    {
                        const crearProducto = new ProductModel({Name: obtenerProductoCART.NameProduc, Cant: stockRestante, Price: precioProducto})
                        crearProducto.save();
                       //Eliminar valores del array
                        ExisiteCart.Detalle = ExisiteCart.Detalle.filter((producto) => {
                        return producto.NameProduc != obtenerProductoCART.NameProduc
                        })
                        ExisiteCart.Price = ExisiteCart.Price - obtenerProductoCART.Price
                        ExisiteCart.save();
                        obtenerProductoCART.delete();
                        res.status(200).send(`Se elimino el producto ${req.body.Nombre_Producto} del carrito \ny se devolvió el stock a la base de datos Productos.`)
                    } 
                    if (nuevaCantidad.Cantidad > 0 && ExisiteCart && obtenerProductoCART.Price && precioCARTAntiguo)
                    {
                        const crearProducto = new ProductModel({Name: obtenerProductoCART.NameProduc, Cant: stockRestante, Price: precioProducto})
                        obtenerProductoCART.Cant = nuevaCantidad.Cantidad
                        obtenerProductoCART.Price = GetPriceTotal(precioProducto, nuevaCantidad.Cantidad)
                        crearProducto.save();
                        obtenerProductoCART.save();
                        //Actualizar Array
                        const index = ExisiteCart.Detalle.findIndex((producto) => {
                            return producto.NameProduc == obtenerProductoCART.NameProduc
                            });
                            const updateArray = ExisiteCart.Detalle.splice(index, 1)
                            ExisiteCart.Detalle.push(obtenerProductoCART);
                            //Comprobar si existe solo un producto en el carritp
                            ExisiteCart.Price = ExisiteCart.Price + obtenerProductoCART.Price - precioCARTAntiguo 
                            ExisiteCart.save();
                        res.status(200).send(`Se actualizo con exito el producto del carrito:\n* Producto: ${obtenerProductoCART.NameProduc}\n* Nueva cantidad: ${obtenerProductoCART.Cant}\n* Nuevo precio: ${obtenerProductoCART.Price}\n\nSe devolvió a la base de datos producto:\n* Producto: ${req.body.Nombre_Producto}\n* Stock devuelto: ${stockRestante}`)
                    }                       
                }else
                {
                    res.status(400).send(`No se pudo actualizar, debido a que supero la cantidad de stock, el stock total del producto ${obtenerProductoCART.NameProduc} es de: ${obtenerProductoCART.Cant}`)
                }
            }
            if(!obtenerProductoCART && !obtenerProducto)
            {
                res.status(400).send(`El producto ${req.body.NameProduc} no existe.`)
            }
            
        }
        catch (error)
        {
            res.status(500).send(`Error en el servidor`);
        }
           
    },

   
}



 function CrearCart()
{
    const NewCart = new CartModel({NameCart: "Cart", Detalle: [], Price: 0}); 
    NewCart.save();
}


function GetPrice(precioTOTAL: any, cantidad: any)
{
    //Ecuación utilizada: precio = precioTOTAL/cantidad
    return precioTOTAL/cantidad;
}
function GetPriceTotal(precio: any, cantidad: any)
{
    //Ecuación utilizada: precioTOTAL = precio * cantidad
    return precio * cantidad;
}
function getCantidadTOTAL(cantidad: any, stockRestante: any)
{
    return cantidad + stockRestante;
}

function getstockRestante(nuevaCantidad: any, stockTOTAL: any)
{
    //Ecuación utilizada: stockRestante = stockTOTAL - nuevaCantidad
    return stockTOTAL - nuevaCantidad;
}

function getPreciocarritoList(precioTOTALCARRITOLIST: any, precioTOTALCARRITODETAILS: any)
{
    return precioTOTALCARRITODETAILS + precioTOTALCARRITOLIST;
}

export default DetalleController;