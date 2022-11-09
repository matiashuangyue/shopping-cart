import { Router } from "express";
import DetalleController from "../../controller/detalle";

const router = Router();

//GET
router.get("/", DetalleController.get)

router.post("/", DetalleController.add)

router.delete("/:NameProduc",DetalleController.delete)

router.put("/", DetalleController.put)

export default router;