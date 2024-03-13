const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader")


// createCourse handler function 
exports.createCourse = async(res,res)=>{
    try{
        // fetch the data 
        const{courseName, courseDescription,whatYouWillLearn,price, tag} = req.body;

        // get thumNails
        const thumbnail =  req.files.thumbnailImage;

        //validation 
        if(!courseName || !courseDescription || !whatYouWillLearn ||
        !price ||
        ! tag ||
        !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //check for the instructor 
        

    }catch(error){

    }
}