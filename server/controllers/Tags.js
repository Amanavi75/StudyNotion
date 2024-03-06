const Tag = require("../models/Tags");

//
exports.createTag = async(req,res)=>{
    try{

        //fetch data 
        const{name, description} = req.body;

        //*validation 
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //create entry in db 
        const tagDetails = await Tag.create({
            name:name,
            description:description,
        })

        console.log(tagDetails)

        res.status(200).json({
            success:true ,
            message:"tag created succesFully  "
        })


    }catch(error){
        res.status(500).json({
            success:false ,
            message:"Unable to create tag "
        })
    }
}