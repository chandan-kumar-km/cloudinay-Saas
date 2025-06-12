import { NextRequest,NextResponse } from "next/server";
import {v2 as cloudinary} from "cloudinary"
import {auth} from '@clerk/nextjs/server'
import { imageSize } from 'image-size'

cloudinary.config({
    cloud_name:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_APIKEY,
    api_secret:process.env.CLOUDINARY_SECRET,
})

interface CloudinaryUploadResults{
    public_id:string;
    [key:string]:any
}

export async function POST(req:NextRequest){

const { userId } = await auth();

// if (!userId) {
//     return NextResponse.json({error: "Unauthorized"}, {status: 401})
// }

try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    console.log("File received:", file);

    if(!file){
        return NextResponse.json({error: "File not found"}, {status: 400})
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const dimensions = imageSize(buffer)

    const result = await new Promise<CloudinaryUploadResults>(
        (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder: "next-cloudinary-uploads"},
                (error, result) => {
                    if(error) reject(error);
                    else resolve(result as CloudinaryUploadResults);
                }
            )
            uploadStream.end(buffer)
        }
    )
    return NextResponse.json(
        {
            publicId: result.public_id,
            dimensions:dimensions
        },
        {
            status: 200
        }
    )

} catch (error) {
    console.log("UPload image failed", error)
    return NextResponse.json({error: "Upload image failed"}, {status: 500})
}
}