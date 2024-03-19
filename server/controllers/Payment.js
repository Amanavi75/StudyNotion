const{instance} = require("../config/razorpay");

const Course = require("../models/Course");

const User = require("../models/User");

const mailSender = require("../utils/mailSender")

const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { Mongoose, default: mongoose } = require("mongoose");


//capture the payment and initiate the razorpay order
exports.capturePayment = async(req,res)=>{
    //get courseId and userId

    const {course_Id } = req.body;
    const userId = req.user.id ;

    //validation
    //valid courseId
    if(!course_Id ){
        return res.status(400).json({
            success:false,
            message:"please provide valid course id"
        })
    }
    
    //valid CourseDetail
    let course ;
    try {
       course = await Course.findById(course_Id);

       if(!course ){
        return res.status(400).json({
            success:false,
            message:"unable to fetch the course details"
        })
    }

    //user already pay for the same course

    const uid = new mongoose.Types.ObjectId(userId);

    if(course.studentsEnrolled.includes(uid)){
        return res.status(200).json({
            success:false,
            message:"user already enrolled"
        })
    }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }

    //create order 

    const amount = course.price;
    const currency = "INR"

    const options = {
        amount:amount *100 ,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            course:course_Id,
            userId,
        }
    }

    try{
        //initiate the payment
        const paymentResponse = await instance.orders.create(options)

        console.log(paymentResponse);

        return res.status(200).json({
            success:true,
            //return response
            courseName: course.courseName,
            courseDescription:course.courseDescription,
            thumbnail: course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
    //return response
    
}


//verify signature of razorpay 

exports.verifySignature = async(req,res)=>{
    const webHookSecret = "12345678";

    const signature = req.headers("x-razorpay-signature");

    

}
