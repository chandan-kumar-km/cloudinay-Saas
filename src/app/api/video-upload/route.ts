import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@/generated/prisma";
export const runtime = "nodejs";
import { auth } from "@clerk/nextjs/server";
const prisma = new PrismaClient();

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRET, // Click 'View Credentials' below to copy your API secret
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes?: number;
  duration?: number;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  try {
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_APIKEY ||
      !process.env.CLOUDINARY_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary credentials not found" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "video-uploads",
            transformation: [{ quality: "auto", fetch_format: "mp4" }],
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary error:", error);
              reject(error);
            } else {
              console.log("Upload successful:", result);
              resolve(result as CloudinaryUploadResult);
            }
          }
        );

        if (!buffer || buffer.length === 0) {
          console.error("Buffer is empty or undefined");
          reject(new Error("Empty file buffer"));
          return;
        }

        uploadStream.on("error", (err) => {
          console.error("Stream error:", err);
          reject(err);
        });

        uploadStream.on("finish", () => {
          console.log("Stream finished");
        });
        uploadStream.end(buffer);
      }
    );

    console.log("result ", result);

    function clean(input: string | null | undefined): string {
      if (!input) return "";
      return input
        .replace(/\u0000/g, "") // remove null bytes
        .replace(/[\x00-\x1F\x7F]/g, "") // remove control characters
        .trim();
    }

    const video = await prisma.video.create({
      data: {
        title: clean(title),
        description: clean(description),
        publicId: clean(result.public_id),
        originalSize: clean(String(originalSize)),
        compressedSize: clean(String(result.bytes)),
        duration: result.duration || 0,
      },
    });

    console.log("video - ", video);

    return NextResponse.json({ video, result });
  } catch (error) {
    console.log("UPload video failed", error);
    return NextResponse.json({ error: "UPload video failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
