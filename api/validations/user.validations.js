import Joi from 'joi';

const fetchById = {
    params: Joi.object().keys({
        userId: Joi.string().required(),
    }),
    //body: {}
};

const createUser = {
    body: Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        username: Joi.string().email().lowercase().required(),
        password: Joi.string().required().strict(),
    }),
}

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.string().required(),
    }),
    body: Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        username: Joi.string().email().lowercase().required(),
        password: Joi.string().required().strict().required(),
    }),
}

export default {
    fetchById,
    createUser,
    updateUser,
}