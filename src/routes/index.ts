import ExpressRoutes, {Router} from "express";
import ProductRoutes from "./Products";



const router=Router();

router.use("/Products",ProductRoutes)

export default router