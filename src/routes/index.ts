import ExpressRoutes, {Router} from "express";
import ProductRoutes from "./Products";
import CartRoutes from "./Cart";


const router=Router();

router.use("/Products",ProductRoutes)
router.use("/ProductsInCart",CartRoutes)
export default router