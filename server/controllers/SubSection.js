const SubSection = require("../models/SubSection")
const User = require("../models/User")
const Course = require("../models/Course");
const Section = require("../models/Section");

const {uploadImageToCloudinary} = require("../utils/imageUploader")



exports.createSubSection = async(req,res)=>{

    try {
        const{sectionId, title ,timeDuration,description} = req.body;

    const video = req.files.videoFile;

    if(!sectionId || !title || !timeDuration || !description || !video){

        return res.status(400).json({
            success:false,
            message:"all fields are required"
        })
    }

   const uploadDetails  = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

   const subSectionDetails  = await SubSection.create({

    title :title,
    timeDuration:timeDuration,
    description :description ,
    videoUrl:uploadDetails.secure_url,
   }) 

   const updatedSection = await Section.findByIdAndUpdate(
    {
       _id: sectionId,
    },{
        $push :{
            subSectionDetails:subSectionDetails._id,
        } 
    },
    {new:true}
   )

   return res.status(200).json({
    success:true,
    message:"created subsection successfully",
    data:updatedSection
   })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to create subSection , please try again",
            error:error.message,
        })
    }
    
}

//todo upadte and delete controller 
exports.updateSubSection = async(req,res)=>{

    try {
        const{subSectionName , SubSectionId} = req.body ;

    if(!sectionName || !SubSectionId){
        return res.status(400).json({
            success:false,
            message:"all fields are required"
        })
    } 

    const updatedSubSection = await SubSection.findByIdAndUpdate(
        {
            SubSectionId,
        },
        {
            $push:{
                subSectionName:subSectionName,
            }
        },
        {new:true}
    ) ;

    return res.status(200).json({
        success:true,
        message:"subsection updated successfully",
        updatedSubSection
    })


    } catch (error) {
        
        return res.status(500).json({
            success:false,
            message:"unable to update subsection , please try again"
        })
    }
}

exports.deleteSubSection = async(req,res)=>{

   try {

    const{subSectionId} = req.params;

    await SubSection.findByIdAndDelete({subSectionId})

    return res.status(200).json({
        success:true,
        message:"subSection deleted successfully"
    })
    
   } catch (error) {

    return res.status(500).json({
        success:false,
        message:"unable to delete subsection, please try again"
    })
    
   }
}

//TODO VERIFY IT WITH THE VIDEO 