import { Router } from "express";
import cartController from "../../controller/Cart";
//importando metodos 
const router = Router();

router.get("/",cartController.get)

export default router