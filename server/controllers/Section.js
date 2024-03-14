const Section = require("../models/Section")
const Course = require("../models/Course")


exports.createSection = async(req,res)=>{
    try{
        //data fetch 
        const{sectionName , courseId} = req.body;

        //data validation 
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }
        //create section 

        const newSection = await Section.create({sectionName:sectionName})
        //update course with section ObjectId
        const updatedCourseDetails = await Course.findByIdAndUpdate({courseId},
            {

                $push: {
                    courseContent:newSection._id,

                }
            },
            {new:true}
        ).populate();
        //return response 

        return res.status(200).json({
            success:true,
            message:"Section created successfuly ",
            data:updatedCourseDetails,
        })


    }catch(error){

        return res.status(500).json({
            success:false,
            message:"unable to create section , try again",
            error:error.message
        })
    }
}