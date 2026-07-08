import User from "../models/userModel";
import ErrorHandler from "../utils/errorhandler";
import catchAsyncError from "./catchAsyncError";



export const isAuthenticatedUser = catchAsyncErros(async(req,res,next) => {
    const {userId} = req.auth
    if(!userId){
        return next(new ErrorHandler("Please login to access this resource", 403))
    }

    req.user = await User.findById(userId)
    next()
})