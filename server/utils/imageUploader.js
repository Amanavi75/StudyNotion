const cloudinary = require('cloudinary').v2;


exports.uploadImageToCloudinary = async(file,folder,height,quality) =>{

    const options = {folder};

    if(height){
        options.height = height; // height of the image 
    }
    if(quality){
        options.quality= quality ; // quality of image 

    }

    options.resource_type = "auto"; // will automatically determine the file type 

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}