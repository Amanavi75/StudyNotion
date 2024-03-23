const RatingAndReview = require("../models/RatingAndReview");

const Course = require("../models/Course");

//create rating  and review
exports.createRating= async(req,res)=>{
    try{

        //get userId 
        const userId = req.user.id;

        //fetch data from req
        const {rating, review, courseId} = req.body;

        if(!rating || !review || !courseId){
            return res.status(400).json({
                success:false,
                message:"all fields are mandatory "
            })
        }

        //check if user is enrolled in the course or not 
        const courseDetails = await Course.findOne(
            {
                _id:courseId,
                studentsEnrolled: {$eleMatch: {$eq: userId}}
            },
        );
    
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"unable to fetch the course details"
            })
        }
        //check if  user has already reviewed and rated
        const alreadyReviwed = await RatingAndReview.findOne(
            {
                _id:userId,
                course:courseId,
            }
        )

        if(alreadyReviwed){
            res.status(400).json({
                success:false,
                message:"user has already reviewed once"
            })
        }

        //creating rating and review

        const ratingReview = await RatingAndReview.create({
            User:userId,
            rating:rating,
            review:review
        })
        //update the course with rating 
        const updatedCourse = Course.findByIdAndUpdate(
            {
                courseId,
            },{
                $push:{
                    ratingAndReviews:ratingReview._id,
                }
            },
            {new:true},
        )

        console.log(updatedCourse);
        //return res

        return res.status(200).json({
            success:true,
            message:"rating and review successfully added",
            data:ratingReview
        })
    }catch(error){

        res.status(400).json({
            success:false,
            message:"unable to rate or review",
            error:error.message
        })
    }
     
}
//average rating  and review
exports.getAverageRating  = async(req,res)=>{

    try{

        //get coursedId
        const{courseId} = req.body.courseId;
        //calculate average rating 
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ])
        //return rating 
        if(result.length>0){ //  it means we have some rating
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            }) 
        }

        //if not rating review exist 
        return res.status(200).json({
            success:true,
            message:"average rating is zero",
            averageRating:0
        })

    }catch(error){

        return res.status(500).json({
            success:false,
            message:"not able to find rating",
            error:error.message,
        })
    }
} 
//getAll rating and reviews
exports.getAllRating = async(req,req)=>{
    try {
        const allReviews = await RatingAndReview.find({})
        .sort({rating:"desc"})
        .populate({
            path:"user",
            select:"firstName lastName email image",
        })
        .populate({
            path:"course",
            select:"courseName",

        })
        .exec();


    return res.status(200).json({
        success:true,
        message:"all review fetched successfully",
        data:allReviews
    })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"not able to find rating or reciew",
            error:error.message,
        })
    }  
}