import catchAsyncError from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../utils/errorhandler.js"

export const getUserData =  catchAsyncError(async (req, res, next) => {
    const role = req.user.role
    const recentSearchCities = req.user.recentSearchCities
    res.status(200).json({success: true, role, recentSearchCities})
})

export const storeRecentSearchedCitites = catchAsyncError(async(req,res,next) => {

    const {recentSearchedCity} = req.body;
    const user = await req.user;

    if (user.recentSearchCities.length < 3){
        user.recentSearchCities.push(recentSearchedCity)
    }else{
        user.recentSearchCities.shift();
        user.recentSearchCities.push(recentSearchedCity)
    }

    await user.save();
    res.status(200).json({success: true, message: "City added successfully"});

})