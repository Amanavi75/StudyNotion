const User = require("../models/User")
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt")


//reset Password token
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
        console.log(error)
        return res.status(400).json({
            success:false,
            message:"unable to reset password"
        })
    }
    
    //* host must be from the frontend localHost 
}



//reset password 
exports.resetPassword = async(req,res)=>{
try{
        //data fetch
    
        const {password , confirmPassword , token } = req.body 

        //validation 
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password not matching "
            })
        }
    
        //we will use token to take out the user entry 
        const userDetails = await User.findOne({token:token})
    
        //if no entry it means invalid token 
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"token invalid"
            })
        }
    
        //expiry time check for token 
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.status(500).json({
                success:false,
                message:"token expires"
            })
        }
    
        //now hash the password
        const hashedPassword = await bcrypt.hash(password,10)
    
        //password update  
    
        await User.findOneAndUpdate({token:token},{
            password:hashedPassword,
        },
        {new:true},
        )
    
        return res.status(200).json({
            success:true,
            message:"Password updated successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"unable to reset password"
        })
        }
}