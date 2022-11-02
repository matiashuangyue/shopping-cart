import { Router } from "express";
import cartController from "../../controller/Cart";
//importando metodos 
const router = Router();

router.get("/",cartController.get)
router.post("/", cartController.add)
router.delete("/:Name",cartController.delete)

export default router