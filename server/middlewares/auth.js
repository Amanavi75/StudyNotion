const jwt = require("jsonwebtoken");
require("dotenv").config()

const User = require('../models/User')


//auth middleware 
exports.auth = async(req,res,next)=>{
    try {

        //extract token 
        const token = req.cookies.token 
        || req.body.token 
        || req.header("Authorisation").replace("Bearer", "")

        //if token is missing 
        if(!token){
            return res.status(500).json({
                success:false,
                message:"unable to get token  or token is missing"
            })
        }

        //verify the token
        try {
            const decode = await jwt.verify(token,process.env.JWt_SECRET);

            console.log(decode)
            req.user = decode;

        }catch(error){
            //verification issue
            return res.status(501).json({
                success:false,
                message:"token is invalid"
            })

        }

        next();

    }catch(error){

        return res.status(500).json({
            success:false,
            message:"unable to verify during the authentication"
        });
    }
}