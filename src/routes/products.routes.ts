import { Router } from "express";
import { ProductController } from "../controllers/products.controller";

const productController = new ProductController();
const router = Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id/price', productController.updatePrice);

export default router;