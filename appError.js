class AppError extends Error {
    constructor(message, statusCode) {
        super(message);                   //when we extend  a parent class, we call super in order to call the parent constructor

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;