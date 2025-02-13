const Image  = require('../models/Image');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require("@aws-sdk/lib-storage");



const s3Client = new S3Client({
  region: "ap-south-1", 
});

// GET IMAGE
const getImage = async (userId) => {
    try {
        const image = await Image.findOne({
            where: { user_id: userId }, 
        });


        if (!image) {
            throw new Error('Image not found');
        }

        return {
            file_name: image.file_name,
            id: image.id,
            url: image.url,
            upload_date: image.upload_date,
            user_id: image.user_id,
        };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
};

// DELETE IMAGE
const deleteImage = async (userId) => {
    try {
        const deleteParams = {
            Bucket: process.env.S3_BUCKET_ID,
            Key: `${userId}`, 
        };
        await s3Client.send(new DeleteObjectCommand(deleteParams));

        const result = await Image.destroy({
            where: { user_id: userId}
        });
        return result > 0; 
    } catch (error) {
        throw new Error('Error deleting image: ' + error.message);
    }
};

// POST IMAGE
const postImage = async (imageData, file) => {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET_ID,
            Key: `${imageData.user_id}`, 
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const upload = new Upload({
          client: s3Client,
          params: params
      });

      await upload.done(); 
      console.log("File uploaded successfully.");

        // Create a record in the database
        const createdImage = await Image.create({
            ...imageData,
            url: `${process.env.S3_BUCKET_ID}/${imageData.user_id}/${imageData.file_name}` 
        });

        return {
            file_name: createdImage.file_name,
            id: createdImage.id,
            url: createdImage.url,
            upload_date: createdImage.upload_date,
            user_id: createdImage.user_id,
        };
    } catch (error) {
        throw new Error('Error creating image record or uploading to S3: ' + error.message);
    }
};

module.exports = {
    getImage,
    deleteImage,
    postImage,
    s3Client,
};