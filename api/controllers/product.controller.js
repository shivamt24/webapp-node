import productService from '../services/product.service.js';
import catchAsync from '../utils/catchAsync.js';
import responseHandler from '../utils/responseHandler.js';

import models from '../models/index.js';
const Product = models.Product;

const fetchProductById = catchAsync(async (req, res) => {
    const _id = +req.params.productId;
    const productInfo = await productService.fetchProductById(_id);
    responseHandler(res, productInfo);
});

const updateProduct = catchAsync(async (req, res) => {
    const _id = +req.params.productId;
    const productInfo = req.body;
    const _authUser = req.user;
    const updatedUserInfo = await productService.updateProduct(_id, _authUser, productInfo);
    responseHandler(res, updatedUserInfo);
});

const createProduct = catchAsync(async (req, res) => {
    const userInfo = req.body;
    const _authUser = req.user;
    const createdUser = await productService.createProduct(_authUser, userInfo);
    responseHandler(res, createdUser);
});

const deleteProduct = catchAsync(async (req, res) => {
    const _id = +req.params.productId;
    const _authUser = req.user;
    const status = await productService.deleteProduct(_authUser, _id);
    responseHandler(res, status);
});

const getImageList = catchAsync(async (req, res) => {
    const _productId = +req.params.productId;
    const _authUser = req.user;
    const status = await productService.getImageList(_authUser, _productId);
    responseHandler(res, status);
});

const addImage = catchAsync(async (req, res) => {
    const fileStream = req.files;
    const fileObject = req.body;
    const _productId = +req.params.productId;
    const _authUser = req.user;
    const status = await productService.addImage(_authUser, _productId, fileStream, fileObject);
    responseHandler(res, status);
});

const getImageDetails = catchAsync(async (req, res) => {
    const _productId = +req.params.productId;
    const _imageId = +req.params.imageId;
    const _authUser = req.user;
    const status = await productService.getImageDetails(_authUser, _productId, _imageId);
    responseHandler(res, status);
});

const deleteImage = catchAsync(async (req, res) => {
    const _productId = +req.params.productId;
    const _imageId = +req.params.imageId;
    const _authUser = req.user;
    const status = await productService.deleteImage(_authUser, _productId, _imageId);
    responseHandler(res, status);
});

export default {
    fetchProductById,
    updateProduct,
    createProduct,
    deleteProduct,
    getImageList,
    addImage,
    getImageDetails,
    deleteImage
};