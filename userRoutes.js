const express = require('express')
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
/*const getAllUsers = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

const getUser = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

const createUser = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

const updateUser = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

const deleteUser = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};*/

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);    //This middleware run before all routes below it. So it will protect all below routes as it is a middleware that run in a sequence.

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);   //first use middleware getMe to get current user id and then getOne factory function to get user data.
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

//restricting all routes after this to only for admins
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
