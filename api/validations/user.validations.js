import Joi from 'joi';

const fetchById = {
    params: Joi.object().keys({
        userId: Joi.string().required(),
    }),
};

const createUser = {
    body: Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        username: Joi.string().email().lowercase().required(),
        password: Joi.string().min(5).required().strict(),
    }),
}

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.string().required(),
    }),
    body: Joi.object().keys({
        first_name: Joi.string(),
        last_name: Joi.string(),
        username: Joi.string().email().lowercase(),
        password: Joi.string().min(5).strict(),
    }),
}

export default {
    fetchById,
    createUser,
    updateUser,
}