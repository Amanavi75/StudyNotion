const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        express:5*60,

    }

})

//*function for sending emails

async function sendVerificationEmail(email,otp){
    try{

        const mailResponse = await mailSender(email,"verification Email from study notion",otp);
        console.log("email sent successfully",mailResponse)
    }
    catch(error){
        console.log("error while sending emails in verification process",error);
        throw error;
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp)
    next();
})

module.exports= mongoose.model("OTP",OTPSchema)