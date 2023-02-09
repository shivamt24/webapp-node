import db from '../database/index.js';
import bcrypt from 'bcrypt';
import models from '../models/index.js';
const User = models.User;
const authenticate = async (username, password) => {

    const result = await User.findAll({
        where: {
            username: username
        }
    });
    if (result && result.length !== 0) {
        const passHash = result[0].dataValues.password;
        let authStatus = await bcrypt.compare(password, passHash);
        if (authStatus) {
            return result;
        }
    }

    //const result = await db.query(`SELECT * FROM users where username='${username}'`);
    // if (result && result.rows && result.rows.length !== 0) {
    //     const passHash = result.rows[0].password;
    //     let authStatus = await bcrypt.compare(password, passHash);
    //     if (authStatus) {
    //         return result;
    //     }
    // }
}

export default {
    authenticate
}