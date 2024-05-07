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
            const decode =  jwt.verify(token,process.env.JWT_SECRET);

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

        // sending error if unable to process  the  request
        return res.status(500).json({
            success:false,
            message:"unable to verify during the authentication"
        });
    }
}

//isStudent 
exports.isStudent = async (req,res,next)=>{
    try{
        if(req.user.accountType!="Student"){
            res.status(500).json({
                success:false,
                message:"account doesn't belong to Student category"
            })
        }

        next();

    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"user role can't verified"
        })
    }
}

//isInstructor
exports.isInstructor = async(req,res)=>{
    try {
        if(req.user.accountType!="Instructor"){
            res.status(500).json({
                success:false,
                message:"Id doesn't belong Instructor category"
            })
        }
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"unable to verify instructors id"
        })
    }
}

//isadmin 
exports.isAdmin = async(req,res)=>{
    try {
        if(req.user.accountType!="Admin"){
            res.status(500).json({
                success:false,
                message:"Id doesn't belong Admin category"
            })
        }
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"unable to verify Admin's id"
        })
    }
}
