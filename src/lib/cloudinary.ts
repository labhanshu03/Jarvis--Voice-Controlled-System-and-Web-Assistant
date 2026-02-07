import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (fileBuffer: Buffer, fileName: string): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', public_id: fileName },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    resolve(null);
                } else {
                    resolve(result?.secure_url || null);
                }
            }
        );
        uploadStream.end(fileBuffer);
    });
};

export default uploadOnCloudinary;
