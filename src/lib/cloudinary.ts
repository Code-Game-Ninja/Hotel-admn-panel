import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
    fileBuffer: Buffer,
    folder: string = "hotel"
): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder: `grand-horizon/${folder}`,
                    format: "webp",
                    transformation: [{ quality: "auto", fetch_format: "auto" }],
                },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve({ url: result.secure_url, publicId: result.public_id });
                }
            )
            .end(fileBuffer);
    });
}

export async function deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
