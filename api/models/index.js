import Sequelize from 'sequelize';

import getProductModel from './product.model.js';
import getUserModel from './user.model.js';


// connect to postgres db
const sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD, {
        dialect: 'postgres',
        port: process.env.PGPORT,
        host: process.env.PGHOST,
    },
);

const models = {
    Product: getProductModel(sequelize, Sequelize),
    User: getUserModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
    if ('associate' in models[key]) {
        models[key].associate(models);
    }
});

export {
    sequelize
};

export default models;