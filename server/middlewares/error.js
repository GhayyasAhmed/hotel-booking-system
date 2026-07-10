import ErrorHandler from "../utils/errorhandler.js";

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // mongodb cast error

    if (err.name === "CastError") {
        const message = `Resource not found. Invalid value for ${err.path}.`;
        err = new ErrorHandler(message, 400);
    }

    // mongoose duplicate key error

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        const message = `Duplicate ${field} entered.`;
        err = new ErrorHandler(message, 409);
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((error) => error.message).join(", ");
        err = new ErrorHandler(message, 400);
    }

    // wrong jwt token
    if (err.name === "JsonWebTokenError") {
        const message = "JSON web token is invalid. Please login again.";
        err = new ErrorHandler(message, 401);
    }

    // jwt token expire
    if (err.name === "TokenExpiredError") {
        const message = "JSON web token has expired. Please login again.";
        err = new ErrorHandler(message, 401);
    }

    if (err.type === "entity.parse.failed" || (err instanceof SyntaxError && err.status === 400 && "body" in err)) {
        err = new ErrorHandler("Invalid JSON payload.", 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};

export default errorMiddleware;
