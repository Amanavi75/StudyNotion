const User = require("../models/User")
const mailSender = require("../utils/mailSender");


//reset Password
exports.resetPasswordToken = async(req,res)=>{
    try {
        //get email from req body 
    const{email} = req.body;

    //check user for this email ,and email validation 
    const existingUser = await User.findOne({email:email});

    if(!existingUser){
        return res.status(400).json({
            success:false,
            message:"User not registered"
        })
    }


    //generate token
    const token = crypto.randomUUID()
    //udpdate user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate({email:email},{
        token:token,
        resetPasswordExpires:Date.now()+50*60*1000,
    },
    {new:true} //it means we will get updated document
    )
    //create url
    const url = `http://localhost:3000/update-password/${token}`
    //send mail containing the url 
    await mailSender(email,"password reset Link ",`password${url}`) 

    return res.status(200).json({
        success:true,
        message:"email sent successfully, please check mail and reset password"
    })

    }catch(error){
        console.log(error.message)
    }
    
    //* host must be from the frontend localHost 
}