const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const res = require('express/lib/response');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};    //create empty array
    Object.keys(obj).forEach(el => {                //looping each fileds that are in object to check if allowed fields is in obj.
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

exports.getAllUsers = factory.getAll(User);

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//     /*res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined!'
//     });*/
//     const users = await User.find();    //execute query, but before this pre find middleware executed.

//     //SEND RESPONSE
//     res.status(200).json({
//         status: 'success',
//         results: users.length,
//         data: {
//             users
//         }
//     });
// });

exports.getMe = (req, res, next) => {              //middleware to get current user id from URL so that we can use factory's getOne function.
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {

    // 1) Create error if user POSTs password data

    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    };

    // 2) Update user document
    const filteredBody = filterObj(req.body, 'name', 'email');    //We can update only name and email by this. If we dont filter then user can also update token and other things which we don't want.
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {     // We are not deleting user from database, but only deleting user's account.
    await User.findByIdAndUpdate(req.user.id, { active: false })   //if user deleted itself, then its not actually deleted but acrtive set to false.

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getUser = factory.getOne(User);
// exports.getUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined!'
//     });
// };

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined! Please use /signup instead'
    });
};

//Do Not update passwords with this
exports.updateUser = factory.updateOne(User);
// exports.updateUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined!'
//     });
// };


exports.deleteUser = factory.deleteOne(User);
// exports.deleteUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined!'
//     });
// };