const Category = require("../models/Categories");
const Course = require("../models/Course")
//create tag 
exports.createCategory = async(req,res)=>{
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
        const categoryDetails = await Tag.create({
            name:name,
            description:description,
        })

        console.log(categoryDetails)

        res.status(200).json({
            success:true ,
            message:"category created succesFully  "
        })


    }catch(error){
        res.status(500).json({
            success:false ,
            message:"Unable to create category "
        })
    }
}

//getAll tags 
exports.showAllCategory = async(req,res)=>{
    try{
        const allCategory = await Tag.find({},{name:true, description:true})
        res.status(200).json({
            success:true ,
            message:"all category generated successfully  ",
            allCategory,
        })


    }catch(error){
        res.status(500).json({
            success:false ,
            message:"Unable to get list of all the  category "
        })

    }
}


exports.categoryPageDetails = async(req,res)=>{

    try {
        
    //category Id
    const {categoryId} = req.body 

    //get courses for category id 
    const selectedCategory = await Category.findById(categoryId)
    .populate("courses")
    .exec();

    //validations
    if(!selectedCategory){
        return res.status(400).json({
            success:false,
            message:"data not found"
        })
    }
    //get courses for different category
    const differentCategories =  await  Category.findById(
        {
            _id:{$ne:categoryId},
        }
    )
    .populate("course")
    .exec();
    //get top selling courses
    //todo  

    //return
    return res.status(200).json({
        success:true,
        message:"course Listed below",
        data:{selectedCategory,differentCategories}
    })

    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"data not found",
            error:error.message
        })
    }

}