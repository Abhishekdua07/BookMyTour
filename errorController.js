const AppError = require('./../utils/appError');
const mongoose = require('mongoose');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    console.log(value);

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again', 401);

const sendErrorDev = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // RENDERED WEBSITE
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        })
    }
}
const sendErrorProd = (err, req, res) => {
    // operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

        //Programming or other unknown error: don't leak error details
    } else {
        // 1) Log error
        console.error('ERROR', err);

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        })
    }
};

module.exports = (err, req, res, next) => {              //express automatically knows this is error handling middleware as it has 4 parameters
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        /* res.status(err.statusCode).json({
             status: err.status,
             error: err,
             message: err.message,
             stack: err.stack 
         });
         */
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        /* res.status(err.statusCode).json({
             status: err.status,
             message: err.message
             });
         }
         *///else {
        let error = Object.create(err);
        //error = { ...error, name: err.name, message: err.message };
        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
            //return sendErrorProd(error, res);
        }
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
};