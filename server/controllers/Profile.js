const Profile = require("../models/Profile");
const User = require("../models/User")


exports.updateProfile = async(req,res)=>{

    try {
        //get data 
        const {dateOfBirth="",about="", contactNumber, gender } = req.body
        //get userId
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender || !id ){
             return res.status(500).json({
                success:false,
                message:"all fields are  required"
             })
        }
        //find profile 
        const userDetails  = await User.findById(id);

        const profileId = userDetails.additionalDetails;

        //update
        const profileDetails = await Profile.findById(profileId);

        // upate profile 
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender= gender;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();

        return res.status(200).json({
            success:true,
            message:"profile updated successfully",
            profileDetails
        })

    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Unable to update profile , please try again",
            error:error.message,
        })
    }
}

exports.deleteProfile = async(req,res)=>{

    try {

        //get id
    const id = req.user.id ;

    
    const userDetails = await User.findById(id);
    //validation 
    if(!userDetails){
        return res.status(500).json({
            success:false,
            message:"all fields are  required"
         })
    }
    //find profile 
    const profileId = userDetails.additionalDetails;
    //delete profile 
    await Profile.findByIdAndDelete(profileId);
    // delete user
    await User.findByIdAndDelete(id);

    return res.status(200).json({
        success:true,
        message:"profile deleted successfully",
    })

    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Unable to delete profile , please try again",
            error:error.message,
        })
    }
}

exports.getAllUserDetails = async(req,res)=>{
    try {

        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success:true,
            message:"User data fetched successfully",
            userDetails
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to get the user Data",
            error:error.message,
        })

    }
}