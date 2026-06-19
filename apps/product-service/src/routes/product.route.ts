import { Router } from "express";
import {
  createProduct,
  decrementStock,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { shouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/",              shouldBeAdmin, createProduct);
router.put("/:id",            shouldBeAdmin, updateProduct);
router.delete("/:id",         shouldBeAdmin, deleteProduct);
router.put("/:id/stock",      decrementStock);   // internal — called by order-service
router.get("/",               getProducts);
router.get("/:id",            getProduct);

export default router;
