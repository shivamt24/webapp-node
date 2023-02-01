import db from '../database/index.js';
import bcrypt from 'bcrypt';

const authenticate = async (username, password) => {
    const result = await db.query(`SELECT * FROM users where username='${username}'`);
    if (result && result.rows && result.rows.length !== 0) {
        const passHash = result.rows[0].password;
        let authStatus = await bcrypt.compare(password, passHash);
        if (authStatus) {
            return result;
        }
    }
}

export default {
    authenticate
}