import { v2 as cloudinary } from "cloudinary";
import * as fsPromises from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded", response.url);
    await fsPromises.unlink(localFilePath); // Use fsPromises.unlink for asynchronous unlink
    return response;
  } catch (error) {
    console.error("Error during upload or unlink:", error);
    await fsPromises.unlink(localFilePath); // Ensure the local file is deleted in case of an error
    return null;
  }
};  

export { uploadOnCloudinary };
