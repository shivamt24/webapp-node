import express from 'express';
import productController from '../controllers/product.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import productValidations from '../validations/product.validations.js';
import requestValidatorMiddleware from '../middlewares/requestValidator.middleware.js';


const router = express.Router();

router.route('/:productId')
    .get(requestValidatorMiddleware(productValidations.fetchProductById), productController.fetchProductById)
    .put(requestValidatorMiddleware(productValidations.updateProductPut), authMiddleware(), productController.updateProduct)
    .patch(requestValidatorMiddleware(productValidations.updateProductPatch), authMiddleware(), productController.updateProduct)
    .delete(requestValidatorMiddleware(productValidations.deleteProduct), authMiddleware(), productController.deleteProduct);

router.route('/:productId/image')
    .get(authMiddleware(), productController.getImageList)
    .post(authMiddleware(), productController.addImage);

router.route('/:productId/image/:imageId')
    .get(authMiddleware(), productController.getImageDetails)
    .delete(authMiddleware(), productController.deleteImage);

router.route('/')
    .post(requestValidatorMiddleware(productValidations.createProduct), authMiddleware(), productController.createProduct);

export default router;