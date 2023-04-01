import httpStatus from 'http-status';
import _ from 'lodash';
import db from '../database/index.js';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError.js';
import models from '../models/index.js';
import Lynx from 'lynx';

const User = models.User;
//var metrics = new Lynx('localhost', 8125);

const createUser = async (userInfo) => {
    //var timer = metrics.createTimer('user.createUser.time', 0.1);
    //global.statsD.increment('createUser');

    if (_.isEmpty(userInfo)) {
        throw new AppError(httpStatus.NO_CONTENT, `Error: No content provided to update`);
    }
    const userCheck = await User.findAll({
        where: {
            username: userInfo.username
        }
    });

    if (userCheck.length > 0) {
        throw new AppError(httpStatus.BAD_REQUEST, `Error: The username: ${userInfo.username} is not unique`);
    }

    let pass = await bcrypt.hash(userInfo.password, 10);
    const result = await User.create({
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        username: userInfo.username,
        password: pass,
    });
    delete result.dataValues.password;

    //metrics.increment('user.createUser');
    //await timer.stop();
    return result.dataValues;

    // if (_.isEmpty(userInfo)) {
    //     throw new AppError(httpStatus.NO_CONTENT, `Error: No content provided to update`);
    // }

    //const userCheck = await db.query(`SELECT * FROM users where username= '${userInfo.username}'`);

    // if (userCheck.rowCount !== 0) {
    //     throw new AppError(httpStatus.BAD_REQUEST, `Error: The username: ${userInfo.username} is not unique`);
    // }

    //let pass = await bcrypt.hash(userInfo.password, 10);
    //const result = await db.query(`INSERT INTO users(first_name, last_name, username, password) values ('${userInfo.first_name}', '${userInfo.last_name}', '${userInfo.username}', '${pass}') returning id, first_name, last_name, username, account_created, account_updated`);

    //return result.rows[0];
};

const fetchUserById = async (_id, _authUser) => {
    //global.statsD.increment('getUser');
    if (+_id === +_authUser[0].dataValues.id) {
        const result = await User.findAll({
            attributes: {
                exclude: ['password']
            },
            where: {
                id: _id
            }
        });
        //metrics.increment('user.getAllUser');
        return result[0].dataValues;
    } else {
        throw new AppError(httpStatus.FORBIDDEN, `Error: The User is forbidden to access ID: ${_id}`);
    }

    // if (_id === _authUser.rows[0].id) {
    //     const result = await db.query(`SELECT id, first_name, last_name, username, account_created, account_updated FROM users where id=${_id}`);
    //     console.log(result);
    //     return result.rows[0];
    // } else {
    //     throw new AppError(httpStatus.FORBIDDEN, `Error: The User is forbidden to access ID: ${_id}`);
    // }

};

const updateUser = async (_id, _authUser, userInfo) => {
    //global.statsD.increment('updateUser');
    //_authUser.rows[0].id
    if (+_id === +_authUser[0].dataValues.id) {
        if (_.isEmpty(userInfo)) {
            throw new AppError(httpStatus.NO_CONTENT, `Error: No content provided to update`);
        }
        if (userInfo.username !== _authUser[0].dataValues.username) {
            throw new AppError(httpStatus.BAD_REQUEST, `Error: The username cannot be modified`);
        }
        if (userInfo.password) {
            userInfo.password = await bcrypt.hash(userInfo.password, 10);
        }

        let query = updateUserByID(_id, userInfo);
        //const result = await db.query(query);
        console.log(query);


        const updateObject = {};
        Object.keys(userInfo).map((key) => {
            key = key.trim();
            let value = userInfo[key];
            //updateObject.push(`${key} : '${userInfo[key]}'`)
            updateObject[key.trim()] = value.trim();
        });
        console.log(updateObject);

        const status = await User.update(userInfo, {
            where: {
                id: _id
            }
        })
        //metrics.increment('user.updateUser');
        //return status;
    } else {
        throw new AppError(httpStatus.FORBIDDEN, `Error: The User is forbidden to modify ID: ${_id}`);
    }
};

let updateUserByID = (id, cols) => {
    var query = ['UPDATE users'];
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
    createUser,
    fetchUserById,
    updateUser,
    updateUserByID,
}