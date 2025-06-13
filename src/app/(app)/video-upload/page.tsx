"use client";
import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import "reactjs-popup/dist/index.css";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [Error, setError] = useState("");
  const [enableEditing, setenableEditing] = useState(false);
  const [selectedCompress, setselectedCompress] = useState(false);

  const videoQualityOptions = ["best", "good", "eco", "low"];

  type UploadResponse = {
    publicId: string;
    originalSize: number;
  };
  const [uploadResponse, setuploadResponse] = useState<UploadResponse | null>(
    null
  );

  //max file size of 60 mb

  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleVideoCompressAndDownload = async (option: string) => {
    try {
      if (!uploadResponse) {
        toast.error("No upload response found. Please upload a video first.");
        return;
      }
      const videoUrl = `http://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/q_auto:${option},f_auto/${uploadResponse.publicId}.mov`;

      // First check the size
      const res = await fetch(videoUrl, { method: "HEAD" });
      const sizeInBytes = await res.headers.get("Content-Length");
      const sizeInMB = (parseInt(sizeInBytes || " ") / 1000000).toFixed(2);
      console.log(`Compressed size: ${sizeInMB} MB`);

      // Then download the video
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed-video-${uploadResponse.publicId}.mov`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error compressing or downloading video:", error);
      toast.error("Failed to compress or download video. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      //TODO: add notification
      alert("File size too large");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const res = await axios.post("/api/video-upload", formData);
      console.log(res);
      setuploadResponse(res.data.video);
      toast.success("Video uploaded successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload video. Please try again.");
      // notification for failure
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Video File</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>

        {isUploading && (
          <div className="mt-2 text-gray-500">
            Uploading your video, please wait...
            <progress className="progress progress-primary w-full"></progress>
          </div>
        )}
      </form>
      {Error && (
        <div className="mt-4 text-red-500">
          <p>Error: {Error}</p>
        </div>
      )}
      {uploadResponse && (
        <div className="mt-8 ">
          <h2 className="text-xl font-semibold mb-4">Uploaded Video</h2>
          <CldVideoPlayer
            width="1620"
            height="1080"
            src={uploadResponse.publicId}
            // src="video-uploads/d0sozde8ehwicksvdo1r"
            fontFace="Source Serif Pro"
            transformation={{
              gravity: "auto",
            }}
            onError={(err: Error) => setError(err.message)}
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Video Details</h3>
            <p>
              <strong>Title:</strong> {title}
            </p>
            <p>
              <strong>Description:</strong> {description}
            </p>
            <p>
              <strong>File Size:</strong>{" "}
              {(uploadResponse?.originalSize / (1024 * 1024)).toFixed(2)} MB
            </p>
            <div>
              <button
                type="submit"
                className="btn btn-primary mt-4"
                disabled={!uploadResponse}
                onClick={() => setenableEditing((prev) => !prev)}
              >
                Edit Video
              </button>
              <button
                type="submit"
                className="btn btn-primary mt-4  ml-4"
                disabled={!uploadResponse}
                onClick={() => setselectedCompress((prev) => !prev)}
              >
                compress Video
              </button>
            </div>
            {enableEditing && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Edit Video </h3>
                <p>comming Soon .... !</p>
              </div>
            )}
            {selectedCompress && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">
                  compress and Download Video{" "}
                </h3>
                {videoQualityOptions.map((option) => (
                  <button
                    key={option}
                    className="btn btn-secondary mr-2 mb-2"
                    onClick={() => {
                      toast.success(`Video compressed to ${option} quality`);
                      handleVideoCompressAndDownload(option);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default VideoUpload;
