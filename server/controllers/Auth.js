const User = require("../models/User")
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");

//send otp 
exports.sendOTP = async(req,res)=>{
    try{
        const {email} = req.body();

        //check if user already exist 
        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent){
            return res.status(401).json({
            success:false,
            message:"User already exist"
            })
        }

        //generate otp 
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        console.log("OTP generated",otp);

        //check unique otp 

        const result = await OTP.findOne({otp:otp});
        
        // every time we are getting result for the duplicate otp we will generate new
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })

            result = await OTP.findOne({otp:otp});
        }

        //create an entry in db for otp 
        const otpPayload = ({email,otp});

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody)

        return res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"unable to send otp "
        })
    }
    
}


//sign up 
exports.signUp = async(req,res)=>{
    //data fetch 
    const {firstName,lastName,email} = req.body();

    if(!(firstName,lastName,email)){
        return res.status(400).json({
            success:false,
            message:"unable to get user data "
        })
    }

    


}