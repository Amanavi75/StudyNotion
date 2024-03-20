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
    
}


//verify signature of razorpay 

exports.verifySignature = async(req,res)=>{
    const webHookSecret = "12345678";

    const signature = req.headers("x-razorpay-signature");

    const shasum  = crypto.createHmac("sha256",webHookSecret)
    //used to check integirity 
    //hmac = hashed based message authentication code , sha-  secure hashing algorithm 
    shasum.update(JSON.stringify(req.body)) 
    // converted to string 
    //* whenever we run some hashing on any string the output that we get in manier cases they are known as digest (mostly in hexdecimal)
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log("payment is authorized")

        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try {
            //full fil the action 


            //find the course and enroll the student in it 

            const enrolledCourse = await Course.findOneAndUpdate(
                {
                  _id:courseId,  
                },
                {
                    $push: {studentsEnrolled :userId},

                },
                {new:true},
            )

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:'Course not found',
                })
            }

            console.log(enrolledCourse);

            //find the student and add the course in their list of enrolled Course

            const enrolledStudent = await User.findOneAndUpdate(
                {_id:userId},
                {$push:{courses:courseId}},
                {new:true}

            )

            console.log(enrolledStudent);

            //send confirmation mail 
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "congratulation from aman",
                "congratulation , you are on boarded into new Course"
            );

            console.log(emailResponse);

            return res.status(200).json({
                success:true,
                message:"signature verified and course added "
            })


        } catch (error) {
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }else {

        return res.status(500).json({
            success:false,
            message:"inavlid request",
        })
    }



}
