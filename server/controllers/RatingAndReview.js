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



//getAll rating and review 