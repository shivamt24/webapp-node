import Joi from 'joi';

const fetchProductById = {
    params: Joi.object().keys({
        productId: Joi.string().required(),
    }),
    //body: {}
};

const createProduct = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        sku: Joi.string().required(),
        manufacturer: Joi.string().required(),
        quantity: Joi.number().integer().min(1).max(100).required(),
    }),
}

const deleteProduct = {
    params: Joi.object().keys({
        productId: Joi.string().required(),
    }),
    //body: {}
}

const updateProductPatch = {
    params: Joi.object().keys({
        productId: Joi.string().required(),
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        description: Joi.string(),
        sku: Joi.string(),
        manufacturer: Joi.string(),
        quantity: Joi.number().integer().min(1).max(100),
    }),
}

const updateProductPut = {
    params: Joi.object().keys({
        productId: Joi.string().required(),
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        sku: Joi.string().required(),
        manufacturer: Joi.string().required(),
        quantity: Joi.number().integer().min(1).max(100).required(),
    }),
}

export default {
    fetchProductById,
    createProduct,
    updateProductPut,
    deleteProduct,
    updateProductPatch,
}