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

exports.updateSection = async(req,res)=>{
    try{
        const {sectionName, sectionId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }

        const updatedSection = await Section.findByIdAndUpdate({sectionId},{
            $push:{
                sectionName:sectionName,

            }

        },
        {new:true}    
        );

        return res.status(200).json({
            success:true,
            message:"Section updated successfuly ",
            data:updatedSection,
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to update section , please try again"
        })
    }
}


exports.deleteSection = async(req,res)=>{
    try {

        const{sectionId} = req.params;

        await Section.findByIdAndDelete(sectionId);


        return res.status(200).json({
            success:true,
            message:"Section deleted successfuly ",

        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to delete section , please try again"
        })
    }
}