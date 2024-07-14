// error.js (middlewares)
const httpStatus = require('http-status')
const ApiError = require('../errors/ApiError')

const notFoundErrorHandler = (req, res, next) => {
    const error = new ApiError(httpStatus.NOT_FOUND, 'Resource Not Found')
    next(error)
}

const globalErrorHandler = (err, req, res, next) => {
    res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
    res.json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    })
}

module.exports = {
    notFoundErrorHandler,
    globalErrorHandler,
}
