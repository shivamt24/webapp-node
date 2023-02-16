import httpStatus from 'http-status';
import _ from 'lodash';
import db from '../database/index.js';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError.js';
import models from '../models/index.js';
const Product = models.Product;

//sku is unique
//
const createProduct = async (_authUser, productInfo) => {

    const productCheck = await Product.findAll({
        where: {
            sku: productInfo.sku
        }
    });
    if (productCheck.length > 0) {
        throw new AppError(httpStatus.BAD_REQUEST, `Error: The sku: ${productInfo.sku} is not unique`);
    }

    const product = await Product.create({
        name: productInfo.name,
        description: productInfo.description,
        sku: productInfo.sku,
        manufacturer: productInfo.manufacturer,
        quantity: productInfo.quantity,
        owner_user_id: _authUser[0].dataValues.id
    });

    return product.dataValues;


    // const productCheck = await db.query(`SELECT * FROM products where sku= '${productInfo.sku}'`);
    // if (productCheck.rowCount !== 0) {
    //     throw new AppError(httpStatus.BAD_REQUEST, `Error: The sku: ${productInfo.sku} is not unique`);
    // }
    // const result = await db.query(`INSERT INTO products(name, description, sku, manufacturer, quantity, owner_user_id) values ('${productInfo.name}', '${productInfo.description}', '${productInfo.sku}', '${productInfo.manufacturer}', '${productInfo.quantity}', '${_authUser.rows[0].id}') returning *`);

    // return result.rows[0];
    //return console.log("Create Product Called");
};

const fetchProductById = async (_id) => {
    const product = await Product.findAll({
        where: {
            id: _id
        }
    });
    if (product.length === 0) {
        throw new AppError("404", `Error: The product with id: ${_id} does not exists`);
    }
    return product[0].dataValues;
    //const product = await db.query(`SELECT * FROM products where id=${_id}`);
    // if (product.rowCount === 0) {
    //     throw new AppError(httpStatus.BAD_REQUEST, `Error: The product with id: ${_id} does not exists`);
    // }
    // return product.rows[0];

};

const updateProduct = async (_id, _authUser, productInfo) => {

    // const product = await Product.findAll({
    //     where: {
    //         id: _id
    //     }
    // });
    // if (product.length === 0) {
    //     throw new AppError(httpStatus.BAD_REQUEST, `Error: The product with id: ${_id} does not exists`);
    // }
    // if (product[0].dataValues.owner_user_id !== _authUser[0].dataValues.id) {
    //     throw new AppError(httpStatus.FORBIDDEN, `Error: The User is forbidden to update product with ID: ${_id}`);
    // }
    // const result = await Product.update({},{
    //     where:{
    //         id: _id
    //     }
    // });

    const product = await db.query(`SELECT * FROM products where id=${_id}`);
    if (product.rowCount === 0) {
        throw new AppError("404", `Error: The product with id: ${_id} does not exists`);
    }
    const check = await db.query(`SELECT * FROM products where sku='${productInfo.sku}'`);
    if (check.rowCount !== 0 && +product.rows[0].id !== +check.rows[0].id) {
        throw new AppError(httpStatus.BAD_REQUEST, `Error: The product with sku is not unique`);
    }
    if (product.rowCount === 0) {
        throw new AppError("404", `Error: The product with id: ${_id} does not exists`);
    }
    //_authUser.rows[0].id
    if (+product.rows[0].owner_user_id !== +_authUser[0].dataValues.id) {
        throw new AppError(httpStatus.FORBIDDEN, `Error: The User is forbidden to update product with ID: ${_id}`);
    }

    let query = updateProductByID(_id, productInfo);
    console.log(query);
    const result = await db.query(query);



};

const deleteProduct = async (_authUser, _id) => {

    const product = await Product.findAll({
        where: {
            id: _id
        }
    });
    if (product.length === 0) {
        throw new AppError("404", `Error: The product with id: ${_id} does not exists`);
    }
    if (+product[0].dataValues.owner_user_id !== +_authUser[0].dataValues.id) {
        throw new AppError(httpStatus.FORBIDDEN, `Error: The User is forbidden to delete product with ID: ${_id}`);
    }

    const status = await Product.destroy({
        where: {
            id: _id
        }
    });

    //const product = await db.query(`SELECT * FROM products where id=${_id}`);
    // if (product.rowCount === 0) {
    //     throw new AppError(httpStatus.BAD_REQUEST, `Error: The product with id: ${_id} does not exists`);
    // }
    // if (product.rows[0].owner_user_id !== _authUser.rows[0].id) {
    //     throw new AppError(httpStatus.FORBIDDEN, `Error: The User is forbidden to delete product with ID: ${_id}`);
    // }

    //const status = await db.query(`DELETE FROM products where id=${_id}`);

    //return status;

}

let updateProductByID = (id, cols) => {
    var query = ['UPDATE products'];
    query.push('SET');
    var set = [];

    Object.keys(cols).map((key) => {
        set.push(`${key} = '${cols[key]}'`)

    });
    query.push(set.join(', '));

    query.push('WHERE id = ' + id);
    return query.join(' ');
};

export default {
    createProduct,
    fetchProductById,
    updateProduct,
    updateProductByID,
    deleteProduct
}