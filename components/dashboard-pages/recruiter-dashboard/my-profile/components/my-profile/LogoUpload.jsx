"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { updateUserPic } from "@/lib/api";

export default function PicUploader({ id, pic }) {
  const [picData, setPicData] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (pic && !picData) {
      setPicData({ url: pic, publicId: "" });
      setSuccessMsg(true);
    }
  }, [pic]);

  const handlePicUpload = async (result, widget) => {
    const info = result.info;
    setIsUploading(true);
    setError("");
    widget.close();

    const uploadedPic = {
      url: info.secure_url,
      publicId: info.public_id,
    };

    try {
      await updateUserPic(id, uploadedPic.url, uploadedPic.publicId);
      setPicData(uploadedPic);
      setSuccessMsg(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="uploading-outer">
      {!successMsg ? (
        <>
          <CldUploadWidget
            uploadPreset={
              process.env.NEXT_PUBLIC_NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
            }
            options={{
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
              resourceType: "image",
              clientAllowedFormats: ["jpg", "png", "jpeg"],
              multiple: false,
              maxFileSize: 200 * 1024,
              folder: "profile_pictures",
              sources: ["local", "camera"],
              showPoweredBy: false,
            }}
            onSuccess={(result, { widget }) => handlePicUpload(result, widget)}
            onError={(uploadErr, { widget }) => {
              console.error("Upload error:", uploadErr);
              setError(uploadErr);
              setIsUploading(false);
              widget.close();
            }}
          >
            {({ open }) => (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    open();
                  }}
                  className="uploadButton-button ripple-effect p-3 m theme-btn btn-style-one"
                >
                  Upload Profile Picture
                </button>
                <div style={{ marginLeft: "10px" }} className="text">
                  Max file size 200KB
                </div>
              </>
            )}
          </CldUploadWidget>
          {error && <p className="ui-danger mb-0">{error}</p>}
        </>
      ) : (
        <>
          {picData?.url && (
            <div
              style={{
                margin: "10px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={picData.url}
                alt="Uploaded Profile"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
              <CldUploadWidget
                uploadPreset={
                  process.env.NEXT_PUBLIC_NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                }
                options={{
                  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                  resourceType: "image",
                  clientAllowedFormats: ["jpg", "png", "jpeg"],
                  multiple: false,
                  maxFileSize: 200 * 1024,
                  folder: "profile_pictures",
                  sources: [
                    "local",
                    "camera",
                    "local",
                    "google_drive",
                    "dropbox",
                  ],
                  showPoweredBy: false,
                }}
                onSuccess={(result, { widget }) =>
                  handlePicUpload(result, widget)
                }
                onError={(uploadErr, { widget }) => {
                  console.error("Upload error:", uploadErr);
                  setError(uploadErr);
                  setIsUploading(false);
                  widget.close();
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    className="theme-btn btn-style-one p-4"
                    onClick={() => {
                      setError("");
                      open();
                    }}
                    style={{ marginTop: "10px" }}
                  >
                    Change Picture
                  </button>
                )}
              </CldUploadWidget>
            </div>
          )}
        </>
      )}
      {error && <p className="ui-danger px-3 mb-0">{error?.status}</p>}
    </div>
  );
}
