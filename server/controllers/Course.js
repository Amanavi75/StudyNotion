const Course = require("../models/Course");
const Tag = require("../models/category");
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
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log(instructorDetails);

        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"unable to find the instructor details"
            });
        }

        //  check for the tag is valid or not
        const tagDetails = await Tag.findById(tag);

        if(!tagDetails){
            return res.status(400).json({
                success:false,
                message:"unable to find the tag details"
            });
        }

        //upload to cloudinary 

        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create entry in db 

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url
        })


        //add the new course to user schema of instructor

        await User.findByIdUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {
                new:true,
            }
            )

            //add the tag schema to

             await Tag.findByIdUpdate({
                _id:tagDetails._id,
             },
             {
                $push:{
                    course:newCourse._id,
                }
             }
             )
            return res.status(200).json({
            success:true,
            message:"new course successfully created",
            data:newCourse
            })


    }catch(error){
        console.log(error);

        return res.status(500).json({
            success:false,
            message:"unable to create newCourse",
            error:error.message,
            
        })
    }
}


// get all courses 
exports.showAllCourses = async (req,res) =>{
    try{
        const allCourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentsEnrolled:true,}).populate("instructor").exec();


        return res.status(200).json({
            success:true,
            message:"displaying all courses",
            data:allCourses,
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch courseDetails",
            error:error.message,
        })
    }
}