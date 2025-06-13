"use client";
import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import toast, { Toaster } from "react-hot-toast";
import * as components from "@/components/Popup/index";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

const AdvEditOptions = [
  "Angle",
  "Background",
  "Enhance",
  "Extract",
  // "Gravity",
  "Recolor",
  "Remove",
  "RemoveBackground",
  "Restore",
];

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [AdvEdit, setAdvEdit] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showAdvEditOptions, setShowAdvEditOptions] = useState(false);
  const [imagefilter, setimagefilter] = useState<string | undefined>();
  const [selectedOption, setselectedOption] = useState<
    keyof typeof components | ""
  >("");

  const imageFilterOptions = [
    "al_dente",
    "athena",
    "audrey",
    "aurora",
    "daguerre",
    "eucalyptus",
    "fes",
    "frost",
    "hairspray",
    "hokusai",
    "incognito",
    "linen",
    "peacock",
    "primavera",
    "quartz",
    "red_rock",
    "refresh",
    "sizzle",
    "sonnet",
    "ukulele",
    "zorro",
  ];

  const [imageAguments, setimageAguments] = useState({
    angle: 0,
  });

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  useEffect(() => {
    if (hasError) {
      setIsTransforming(false);
      setUploadedImage(null);
    }
  }, [hasError]);

  useEffect(() => {
    setIsTransforming(true);
    setShowAdvEditOptions(false);
  }, [imageAguments]);

  const handleAdvancedEdit = () => {
    setAdvEdit(!AdvEdit);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });
      await response.json().then((data) => {
        setUploadedImage(data.publicId);
        toast.success("Successfully uploaded!");
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      setHasError(true);
      toast.error(
        error instanceof Error ? error.message : String(error)
      );
      setUploadedImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      });
    toast.success("Successfully Downloaded!");
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Customise Your Social Media Images
      </h1>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Upload an Image</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Choose an image file</span>
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full"
            />
          </div>

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}
          {hasError && (
            <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-800 p-4 rounded-lg">
              Failed to load image.
            </div>
          )}
          {uploadedImage && (
            <div className="mt-6">
              <h2 className="card-title mb-4">Select Social Media Format</h2>
              <div className="form-control">
                <select
                  className="select select-bordered w-full"
                  value={selectedFormat}
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as SocialFormat)
                  }
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  className="btn file-input-primary mt-5"
                  onClick={handleAdvancedEdit}
                >
                  Adanced Edit
                </button>

                <form className="flex items-center justify-end space-x-3 mt-5">
                  <select
                    id="imageFilter"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary"
                    onChange={(e) => {
                      setimagefilter(e.target.value);
                      setIsTransforming(true);
                    }}
                  >
                    <option value="">Effects : none</option>
                    {imageFilterOptions.map((filter) => (
                      <option key={filter} value={filter}>
                        {filter}
                      </option>
                    ))}
                  </select>
                </form>
              </div>

              {AdvEdit && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Advanced Editing Options
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {AdvEditOptions.map((option: string, index: number) => (
                      <button
                        key={index}
                        className="btn"
                        onClick={(e) => {
                          setShowAdvEditOptions(!showAdvEditOptions);
                          setselectedOption(
                            (e.target as HTMLElement)
                              .outerText as keyof typeof components
                          );
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {showAdvEditOptions && (
                <Popup
                  className="rounded-lg shadow-xl"
                  open={showAdvEditOptions}
                  onClose={() => setShowAdvEditOptions(false)}
                  modal
                  nested
                >
                  <div className="relative p-6 bg-white rounded-lg">
                    {/* Dynamic Content */}
                    <div className="mb-4">
                      {selectedOption && components[selectedOption]
                        ? React.createElement(components[selectedOption], {
                            editparms: imageAguments,
                            setEditParms: setimageAguments,
                          })
                        : null}
                    </div>

                    <button
                      className="
                                  absolute 
                                  top-3 right-3 
                                  w-8 h-8 
                                  flex items-center justify-center 
                                  rounded-full 
                                  border border-gray-200 
                                  bg-white 
                                  text-gray-500 
                                  hover:bg-gray-50 
                                  hover:text-gray-700
                                  transition-all 
                                  duration-200
                                  focus:outline-none 
                                  focus:ring-2 
                                  focus:ring-blue-500 
                                  focus:ring-offset-2
                                  active:scale-95
                                "
                      onClick={() => setShowAdvEditOptions(false)}
                      aria-label="Close popup"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </Popup>
              )}
              <div className="mt-6 relative">
                <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                <div className="flex justify-center">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  )}
                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="transformed image"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity="auto"
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                    quality="auto:low"
                    // rawTransformations={[`e_art:${imagefilter}`]}
                    {...(imagefilter
                      ? { rawTransformations: [`e_art:${imagefilter}`] }
                      : {})}
                    {...imageAguments}
                    onError={() => {setHasError(true)
                      toast.error('Error! please Reload');
                    }}
                  />
                </div>
              </div>
              <div className="card-actions justify-end mt-6">
                <button className="btn btn-primary" onClick={handleDownload}>
                  Download for {selectedFormat}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
