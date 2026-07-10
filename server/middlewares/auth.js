import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncError from "./catchAsyncError.js";

export const requireClerkAuth = catchAsyncError(async (req, res, next) => {
    const userId = req.auth?.userId;

    if (!userId) {
        return next(new ErrorHandler("Authentication required. Please login to continue.", 401));
    }

    req.userId = userId;
    next();
});

export const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const userId = req.auth?.userId;

    if (!userId) {
        return next(new ErrorHandler("Authentication required. Please login to continue.", 401));
    }

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User profile not found. Please sync your Clerk account first.", 404));
    }

    req.userId = userId;
    req.user = user;
    next();
});

export const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return next(new ErrorHandler("You are not authorized to access this resource.", 403));
    }

    next();
};
