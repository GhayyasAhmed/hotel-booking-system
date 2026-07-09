import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncError from "./catchAsyncError.js";



export const isAuthenticatedUser = catchAsyncError(async(req,res,next) => {
    const {userId} = req.auth
    if(!userId){
        return next(new ErrorHandler("Please login to access this resource", 403))
    }

    req.user = await User.findById(userId)
    next()
})