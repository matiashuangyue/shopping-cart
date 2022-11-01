import { Router } from "express";
import productController from "../../controller/Product";
//importando metodos 
const router = Router();

router.get("/",productController.get)
router.post("/", productController.add)
router.delete("/:Id",productController.delete)

export default router