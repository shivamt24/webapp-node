import userService from '../services/user.service.js';
import catchAsync from '../utils/catchAsync.js';
import responseHandler from '../utils/responseHandler.js';

const fetchById = catchAsync(async (req, res) => {
    const _id = req.params.userId;
    const _authUser = req.user;
    const userInfo = await userService.fetchUserById(_id, _authUser);
    responseHandler(res, userInfo);
});

const updateUser = catchAsync(async (req, res) => {
    const _id = req.params.userId;
    const userInfo = req.body;
    const _authUser = req.user;
    const updatedUserInfo = await userService.updateUser(_id, _authUser, userInfo);
    responseHandler(res, updatedUserInfo);
});

const createUser = catchAsync(async (req, res) => {
    const userInfo = req.body;
    const createdUser = await userService.createUser(userInfo);
    responseHandler(res, createdUser);
});

export default {
    fetchById,
    updateUser,
    createUser,
};