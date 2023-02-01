import httpStatus from 'http-status';
import AppError from '../utils/AppError.js';
import authService from '../services/auth.service.js';

/**
 * Basic Auth Middleware
 */

const authMiddleware = () => async (req, res, next) => new Promise(async (resolve, reject) => {
        console.log(req.params.userId);
        // check for basic auth header
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            return reject(new AppError(httpStatus.UNAUTHORIZED, 'Missing Authorization Header'));
            // return res.status(401).json({
            //     message: 'Missing Authorization Header'
            // });
        }

        // verify auth credentials
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');
        const user = await authService.authenticate(username, password);
        if (!user) {
            return reject(new AppError(httpStatus.UNAUTHORIZED, 'Invalid Authentication Credentials'));
            // return res.status(401).json({
            //     message: 'Invalid Authentication Credentials'
            // });
        }

        // attach user to request object
        req.user = user;
        resolve();
    })
    .then(() => next())
    .catch((err) => next(err));


export default authMiddleware;