import ExpressRoutes, {Router} from "express";
import ProductRoutes from "./Products";
import CartRoutes from "./Cart";
import DetalleRoutes from "./Detalle"


const router=Router();

router.use("/Products",ProductRoutes)
router.use("/Detalles",DetalleRoutes)
router.use("/ProductsInCart",CartRoutes)
export default router