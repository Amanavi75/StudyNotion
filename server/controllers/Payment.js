const{instance} = require("../config/razorpay");

const Course = require("../models/Course");

const User = require("../models/User");

const mailSender = require("../utils/mailSender")

const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");


//capture the payment and initiate the razorpay order
exports.capturePayment = async(req,res)=>{
    //get courseId and userId
    //validation
    //valid courseId
    //valid CourseDetail
    //user already pay for the same course
    //return response
}