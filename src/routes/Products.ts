import { Router } from "express";
import productController from "../../controller/Product";
//importando metodos 
const router = Router();

router.get("/",productController.get)
router.get("/:Name",productController.getProduct)
router.post("/", productController.add)
router.delete("/:Name",productController.delete)

export default router