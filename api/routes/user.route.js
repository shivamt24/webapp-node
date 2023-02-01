import express from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import userValidations from '../validations/user.validations.js';
import requestValidatorMiddleware from '../middlewares/requestValidator.middleware.js';


const router = express.Router();

router.route('/:userId')
    .get(requestValidatorMiddleware(userValidations.fetchById), authMiddleware(), userController.fetchById)
    .put(requestValidatorMiddleware(userValidations.updateUser), authMiddleware(), userController.updateUser);

router.route('/')
    .post(requestValidatorMiddleware(userValidations.createUser), userController.createUser);

export default router;