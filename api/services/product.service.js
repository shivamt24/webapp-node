import httpStatus from 'http-status';
import _ from 'lodash';
import db from '../database/index.js';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError.js';
import models from '../models/index.js';
import * as dotenv from 'dotenv';
dotenv.config();
import {
    v1 as uuidv1
} from 'uuid';
import {
    S3,
    ListBucketsCommand,
    PutObjectCommand,
    DeleteObjectCommand
} from "@aws-sdk/client-s3";

const Product = models.Product;
const Image = models.Image;
const BUCKET_NAME = process.env.S3_BUCKETNAME
//const BUCKET_NAME = "thabes3";
const s3Client = new S3({
    region: process.env.AWS_REGION
});

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
        throw new AppError(404, `Error: The product with id: ${_id} does not exists`);
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
        throw new AppError(404, `Error: The product with id: ${_id} does not exists`);
    }
    const check = await db.query(`SELECT * FROM products where sku='${productInfo.sku}'`);
    if (check.rowCount !== 0 && +product.rows[0].id !== +check.rows[0].id) {
        throw new AppError(httpStatus.BAD_REQUEST, `Error: The product with sku is not unique`);
    }
    if (product.rowCount === 0) {
        throw new AppError(404, `Error: The product with id: ${_id} does not exists`);
    }
    //_authUser.rows[0].id
    if (+product.rows[0].owner_user_id !== +_authUser[0].dataValues.id) {
        throw new AppError(httpStatus.FORBIDDEN, `Error: The User is forbidden to update product with ID: ${_id}`);
    }

    let query = updateProductByID(_id, productInfo);
    //console.log(query);
    //const result = await db.query(query);
    // const updateObject = {};
    // Object.keys(productInfo).map((key) => {
    //     key = key.trim();
    //     let value = productInfo[key];
    //     //updateObject.push(`${key} : '${userInfo[key]}'`)
    //     updateObject[key.trim()] = value.trim();
    // });
    // console.log(updateObject);

    const status = await Product.update(productInfo, {
        where: {
            id: _id
        }
    })



};

const deleteProduct = async (_authUser, _id) => {

    const product = await Product.findAll({
        where: {
            id: _id
        }
    });
    if (product.length === 0) {
        throw new AppError(404, `Error: The product with id: ${_id} does not exists`);
    }
    if (+product[0].dataValues.owner_user_id !== +_authUser[0].dataValues.id) {
        throw new AppError(httpStatus.FORBIDDEN, `Error: The User is forbidden to delete product with ID: ${_id}`);
    }

    const imageList = await Image.findAll({
        where: {
            product_id: _id
        }
    });

    if (imageList.length > 0) {
        //console.log(imageList);
        await imageList.forEach(async element => {
            const image_key = element.dataValues.s3_bucket_path;
            const _imageId = element.dataValues.image_id;
            const bucketParams = {
                Bucket: BUCKET_NAME,
                Key: image_key
            };
            const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
            console.log(
                "Successfully deleted object: " +
                bucketParams.Bucket +
                "/" +
                bucketParams.Key
            );
            //return image[0].dataValues;

            const status = await Image.destroy({
                where: {
                    image_id: _imageId,
                    product_id: _id
                }
            });
        });
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

const getImageList = async (_authUser, _productId) => {

    const image = await Image.findAll({
        where: {
            product_id: _productId
        }
    });
    if (image.length === 0) {
        throw new AppError(404, `Error: The Image for the Product: ${_productId} does not exists`);
    }
    const data = image.map(i => i.dataValues);
    return data;

}

const addImage = async (_authUser, _productId, fileStream, fileObject) => {

    const product = await db.query(`SELECT * FROM products where id=${_productId}`);
    if (product.rowCount === 0) {
        throw new AppError(404, `Error: The product with id: ${_productId} does not exists`);
    }

    //_authUser.rows[0].id
    if (+product.rows[0].owner_user_id !== +_authUser[0].dataValues.id) {
        throw new AppError(httpStatus.FORBIDDEN, `Error: The User is forbidden to update product with ID: ${_productId}`);
    }

    const validTypes = ["image/avif", "image/bmp", "image/gif", "image/jpeg", "image/png", "image/svg+xml", "image/webp", "image/vnd.microsoft.icon", "image/tiff"];

    if (fileObject.file === undefined) {
        throw new AppError(httpStatus.BAD_REQUEST, `Error: The input key for the image should be file`);
    }

    if (!_.includes(validTypes, fileObject.file.type)) {
        throw new AppError(httpStatus.BAD_REQUEST, `Error: The input file type: ${fileObject.file.type} is not supported. Valid types are avif,bmp,gif,png,jpeg,webp,tiff`);
    }

    const s3_directory = uuidv1();
    const fileName = fileObject.file.name;
    const bucketParams = {
        Bucket: BUCKET_NAME,
        Key: `${s3_directory}/${fileName}`,
        Body: fileStream.file
    };
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    console.log(
        "Successfully uploaded object: " +
        bucketParams.Bucket +
        "/" +
        bucketParams.Key
    );
    //return data;

    const image = await Image.create({
        product_id: _productId,
        file_name: fileName,
        s3_bucket_path: `${s3_directory}/${fileName}`
    });

    return image.dataValues;

}

const getImageDetails = async (_authUser, _productId, _imageId) => {

    const product = await db.query(`SELECT * FROM products where id=${_productId}`);
    if (product.rowCount === 0) {
        throw new AppError(404, `Error: The product with id: ${_productId} does not exists`);
    }

    //_authUser.rows[0].id
    if (+product.rows[0].owner_user_id !== +_authUser[0].dataValues.id) {
        throw new AppError(httpStatus.FORBIDDEN, `Error: The User is forbidden to update product with ID: ${_productId}`);
    }

    const image = await Image.findAll({
        where: {
            image_id: _imageId,
            product_id: _productId
        }
    });
    if (image.length === 0) {
        throw new AppError(404, `Error: The Image with id: ${_imageId} for the Product: ${_productId} does not exists`);
    }

    return image[0].dataValues;

}

const deleteImage = async (_authUser, _productId, _imageId) => {

    const product = await db.query(`SELECT * FROM products where id=${_productId}`);
    if (product.rowCount === 0) {
        throw new AppError(404, `Error: The product with id: ${_productId} does not exists`);
    }

    //_authUser.rows[0].id
    if (+product.rows[0].owner_user_id !== +_authUser[0].dataValues.id) {
        throw new AppError(httpStatus.FORBIDDEN, `Error: The User is forbidden to update product with ID: ${_productId}`);
    }

    const image = await Image.findAll({
        where: {
            image_id: _imageId,
            product_id: _productId
        }
    });
    if (image.length === 0) {
        throw new AppError(404, `Error: The Image with id: ${_imageId} for the Product: ${_productId} does not exists`);
    }
    const image_key = image[0].dataValues.s3_bucket_path;
    const bucketParams = {
        Bucket: BUCKET_NAME,
        Key: image_key
    };
    const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
    console.log(
        "Successfully deleted object: " +
        bucketParams.Bucket +
        "/" +
        bucketParams.Key
    );
    //return image[0].dataValues;

    const status = await Image.destroy({
        where: {
            image_id: _imageId,
            product_id: _productId
        }
    });

}

export default {
    createProduct,
    fetchProductById,
    updateProduct,
    updateProductByID,
    deleteProduct,
    getImageList,
    addImage,
    getImageDetails,
    deleteImage
}