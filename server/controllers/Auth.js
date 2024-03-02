const User = require("../models/User")
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();
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
    try{
        //data fetch 
    const {firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp,

 } = req.body();

 //validation 
 if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !contactNumber || !otp){
     return res.status(400).json({
         success:false,
         message:"all fields are required "
     })
 }

 //check for the password
 if(password!=confirmPassword){
     res.status(500).json({
         success:false,
         message:"invalid password"
     })
 }

 //check for the existing 
 const existingUser = await User.findOne({email});
 if(existingUser){
     res.status(600).json({
         success:false,
         message:"user already exist"
     })
 }

 // find most recently otp
 const recentOtp = OTP.findOne({email}).sort({createdAt:-1}.limit(1))
 console.log(recentOtp)

 //*validating the  otp 
 if(recentOtp.length==0){
     //todo
     return res.status(400).json({
         success:false,
         message:"unable to find otp"
     })

 }else if(otp!=recentOtp){
     //todo
     return res.status(401).json({
         success:false,
         message:"invalid otp"
     })

 }


 //hashPassword
 const hashedPassword = await bcrypt.hash(password,10)

 //create profiledetils and entry in db 
 const profiledetails = await Profile.create({
     //todo
     gender:null,
     dateOfBirth:null,
     about:null,
     contactNumber:null,
 })

 //*users entry in db 
 const user = await User.create({
     firstName,
     lastName,
     email,
     password:hashedPassword,
     accountType,
     additionalDetails:profiledetails._id , // since it is passed as reference,
     course,
     image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
 })

 return res.status(200).json({
     success:true,
     message:"user is registered successfully",
     user,
 })

    }
    catch(error){
        console.log(error)
        return res.status(400).json({
            success:false,
            message:"unable to register user please try again",
        })
    }

}

exports.signin = async(req,res)=>{
    try {
        const {email,password} = req.body;

    if(!email || !password){
        return res.status(500).json({
            success:true,
            message:"unable to fetch email or password"
        })
    }

    const user = await User.findOne({email}).populate("additionalDetails");

    if(!user){
        return res.status(400).json({
            success:false,
            message:"user is not registered, please sign up"
        })
    }

    //generating the jwt 
    if(await bcrypt.compare(password,user.password)){
        const payload = {
            email:user.email,
            id:user._id,
            accountType:user.accountType,
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET, {
            expiresIn:"2h",
        });

        user.token = token;
        user.password= undefined;

        //create cookie and response
        const options = {
            expires:new Date (Date.now() + 3*24*60*60*100),
            httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"logged in successfully"
        })

    } else {
        res.status(401).json({
            success:false,
            message:"password is incorrect"
        })
    }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"login failure, please try again "
        })
    }

}


exports.changePassword = async (req,res)=>{
    //todo
    //get data from the body 
    const {email,password} = req.body;

    // get oldPassword , new password, confirmPassword
//validation 
    //update pwd in db
    //send mail - password updated
    // return response
}