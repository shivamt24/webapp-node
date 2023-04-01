import express from 'express';
import productController from '../controllers/product.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import productValidations from '../validations/product.validations.js';
import requestValidatorMiddleware from '../middlewares/requestValidator.middleware.js';
import metricsMiddleware from '../middlewares/cloudWatch.metrics.middleware.js';


const router = express.Router();

router.route('/:productId')
    .get(metricsMiddleware("getProduct"), requestValidatorMiddleware(productValidations.fetchProductById), productController.fetchProductById)
    .put(metricsMiddleware("putProduct"), requestValidatorMiddleware(productValidations.updateProductPut), authMiddleware(), productController.updateProduct)
    .patch(metricsMiddleware("patchProduct"),requestValidatorMiddleware(productValidations.updateProductPatch), authMiddleware(), productController.patchProduct)
    .delete(metricsMiddleware("deleteProduct"),requestValidatorMiddleware(productValidations.deleteProduct), authMiddleware(), productController.deleteProduct);

router.route('/:productId/image')
    .get(metricsMiddleware("getImageList"),authMiddleware(), productController.getImageList)
    .post(metricsMiddleware("postImage"),authMiddleware(), productController.addImage);

router.route('/:productId/image/:imageId')
    .get(metricsMiddleware("getImageDetails"),authMiddleware(), productController.getImageDetails)
    .delete(metricsMiddleware("deleteImage"),authMiddleware(), productController.deleteImage);

router.route('/')
    .post(metricsMiddleware("postProduct"),requestValidatorMiddleware(productValidations.createProduct), authMiddleware(), productController.createProduct);

export default router;