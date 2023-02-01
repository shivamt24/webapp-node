import httpStatus from 'http-status';
import _ from 'lodash';
import db from '../database/index.js';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError.js';

const createUser = async (userInfo) => {

    if (_.isEmpty(userInfo)) {
        throw new AppError(httpStatus.NO_CONTENT, `Error: No content provided to update`);
    }

    const userCheck = await db.query(`SELECT * FROM users where username= '${userInfo.username}'`);

    if (userCheck.rowCount !== 0) {
        throw new AppError(httpStatus.BAD_REQUEST, `Error: The username: ${userInfo.username} is not unique`);
    }

    let pass = await bcrypt.hash(userInfo.password, 10);
    //let passCheck = await bcrypt.compare(userInfo.password, pass);
    //console.log(passCheck);
    const result = await db.query(`INSERT INTO users(first_name, last_name, username, password) values ('${userInfo.first_name}', '${userInfo.last_name}', '${userInfo.username}', '${pass}') returning id, first_name, last_name, username, account_created, account_updated`);

    return result.rows[0];
};

const fetchUserById = async (_id, _authUser) => {
    console.log("fetchUser called");
    if (_id === _authUser.rows[0].id) {
        const result = await db.query(`SELECT id, first_name, last_name, username, account_created, account_updated FROM users where id=${_id}`);
        console.log(result);
        return result.rows[0];
    } else {
        throw new AppError(httpStatus.FORBIDDEN, `Error: The User is forbidden to access ID: ${_id}`);
    }

};

const updateUser = async (_id, _authUser, userInfo) => {
    if (_id === _authUser.rows[0].id) {
        if (_.isEmpty(userInfo)) {
            throw new AppError(httpStatus.NO_CONTENT, `Error: No content provided to update`);
        }
        if (userInfo.username) {
            const userCheck = await db.query(`SELECT id FROM users where username= '${userInfo.username}'`);

            if (userCheck.rowCount !== 0 && userCheck.rows[0].id !== _authUser.rows[0].id) {
                throw new AppError(httpStatus.BAD_REQUEST, `Error: The username: ${userInfo.username} is not unique`);
            }
        }
        if (userInfo.password) {
            userInfo.password = await bcrypt.hash(userInfo.password, 10);
        }

        let query = updateUserByID(_id, userInfo);
        const result = await db.query(query);
        console.log(query);
        //return result;
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