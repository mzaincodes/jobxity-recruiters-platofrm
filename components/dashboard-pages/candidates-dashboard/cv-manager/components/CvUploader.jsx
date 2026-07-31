// "use client";

// import { useState, useEffect } from "react";
// import { CldUploadWidget } from "next-cloudinary";
// import { updateUserCV } from "@/lib/api";

// export default function CvUploader({ id }) {
//   const [fileData, setFileData] = useState(null);
//   const [error, setError]       = useState("");

//   // whenever fileData changes (i.e. upload succeeded), persist to backend
//   useEffect(() => {
//     if (!fileData || !id) return;

//     (async () => {
//       try {
//         console.log("Persisting CV URL to backend:", id, fileData.url);
//         await updateUserCV(id, fileData.url);
//       } catch (dbErr) {
//         console.error("Error saving CV URL:", dbErr);
//         setError(dbErr.message || "Uploaded but failed to save link.");
//       }
//     })();
//   }, [fileData, id]);

//   return (
//     <>
//       {!fileData ? (
//         <div className="uploading-resume">
//           <div className="uploadButton">
//             <CldUploadWidget
//               uploadPreset={process.env.NEXT_PUBLIC_NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
//               options={{
//                 cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//                 resourceType: "raw",
//                 clientAllowedFormats: ["pdf"],
//                 multiple: false,
//                 maxFileSize: 200 * 1024,
//                 folder: "pdfs",
//                 sources: ["local", "google_drive", "camera", "dropbox"],
//                 showPoweredBy: false,
//               }}
//               onSuccess={(result, { widget }) => {
//                 const info = result.info;
//                 setFileData({
//                   name: `${info.original_filename}.pdf`,
//                   url: info.secure_url,
//                 });
//                 setError("");
//                 widget.close();
//               }}
//               onError={(uploadErr, { widget }) => {
//                 console.error("Upload error:", uploadErr);
//                 setError("Upload failed. Please try again.");
//                 widget.close();
//               }}
//             >
//               {({ open }) => (
//                 <button
//                   type="button"
//                   className="cv-uploadButton"
//                   onClick={() => {
//                     setError("");
//                     open();
//                   }}
//                 >
//                   <span className="title">Upload PDF CV</span>
//                   <span className="text">Max 200 KB, PDF only</span>
//                   <span className="theme-btn btn-style-one px-3 d-flex justify-content-center">
//                     Upload CV
//                   </span>
//                 </button>
//               )}
//             </CldUploadWidget>
//             {error && <p className="ui-danger mb-0">{error}</p>}
//           </div>
//         </div>
//       ) : (
//         <div className="upload-success-message">
//           <p className="text-success">
//             File uploaded successfully.&nbsp;
//             <a
//               href={fileData.url}
//               download={fileData.name}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="view-file-link"
//             >
//               View file
//             </a>
//           </p>
//           {error && <p className="ui-danger mb-0">{error}</p>}
//         </div>
//       )}
//     </>
//   );
// }

// components/CvUploader.jsx

// "use client";

// import { useState, useEffect } from "react";
// import { CldUploadWidget } from "next-cloudinary";
// import { updateUserCV } from "@/lib/api";

// export default function CvUploader({ id , cv}) {
//   const [fileData, setFileData] = useState(null);
//   const [error, setError]       = useState("");
// console.log("Ewrfrf", cv)
//   // whenever a new CV is uploaded, delete old & save new via API helper
//   useEffect(() => {
//     if (!fileData || !id) return;

//     (async () => {
//       try {
//         await updateUserCV(id, fileData.url, fileData.publicId);
//       } catch (e) {
//         console.error("Error saving CV:", e);
//         setError(e.message);
//       }
//     })();
//   }, [fileData, id]);

//   return (
//     <>
//       {!fileData || cv ? (
//         <div className="uploading-resume">
//           <div className="uploadButton">
//             <CldUploadWidget
//               uploadPreset={process.env.NEXT_PUBLIC_NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
//               options={{
//                 cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//                 resourceType: "raw",
//                 clientAllowedFormats: ["pdf"],
//                 multiple: false,
//                 maxFileSize: 200 * 1024,
//                 folder: "pdfs",
//                 sources: ["local", "google_drive", "camera", "dropbox"],
//                 showPoweredBy: false,
//               }}
//               onSuccess={(result, { widget }) => {
//                 const info = result.info;
//                 setFileData({
//                   name: `${info.original_filename}.pdf`,
//                   url: info.secure_url,
//                   publicId: info.public_id,
//                 });
//                 setError("");
//                 widget.close();
//               }}
//               onError={(uploadErr, { widget }) => {
//                 console.error("Upload error:", uploadErr);
//                 setError("Upload failed. Please try again.");
//                 widget.close();
//               }}
//             >
//               {({ open }) => (
//                 <button
//                   type="button"
//                   className="cv-uploadButton"
//                   onClick={() => {
//                     setError("");
//                     open();
//                   }}
//                 >
//                   <span className="title">Upload PDF CV</span>
//                   <span className="text">Max 200 KB, PDF only</span>
//                   <span className="theme-btn btn-style-one px-3 d-flex justify-content-center">
//                     Upload CV
//                   </span>
//                 </button>
//               )}
//             </CldUploadWidget>
//             {error && <p className="ui-danger mb-0">{error}</p>}
//           </div>
//         </div>
//       ) : (
//         <div className="upload-success-message">
//           <p className="text-success">
//             File uploaded successfully.&nbsp;
//             <a
//               href={fileData.url}
//               download={fileData.name}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="view-file-link"
//             >
//               View file
//             </a>
//           </p>
//           <button
//             type="button"
//             className="btn btn-link"
//             onClick={() => {
//               setFileData(null);
//               setError("");
//             }}
//           >
//             Replace CV
//           </button>
//           {error && <p className="ui-danger mb-0">{error}</p>}
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { updateUserCV } from "@/lib/api";

export default function CvUploader({ id, cv, onUpload }) {
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // When cv already exists, treat it as a successful upload
  useEffect(() => {
    if (cv && !fileData) {
      setFileData({
        name: "cv.pdf",
        url: cv,
        publicId: "", // optional if not needed
      });
      setSuccessMsg(true);
    }
  }, [cv]);

  // After uploading new file
  useEffect(() => {
    if (!fileData || !id || !isUploading) return;

    (async () => {
      try {
        await updateUserCV(id, fileData.url, fileData.publicId);
        setSuccessMsg(true);
        setIsUploading(false);
        window.location.reload();
      } catch (e) {
        console.error("Error saving CV:", e);
        setError(e.message);
        setSuccessMsg(false);
        setIsUploading(false);
      }
    })();
  }, [fileData, id, isUploading]);

  return (
    <>
      {!successMsg ? (
        <div className="uploading-resume">
          <div className="uploadButton">
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                resourceType: "raw",
                clientAllowedFormats: ["pdf"],
                multiple: false,
                maxFileSize: 200 * 1024,
                folder: "pdfs",
                sources: ["local", "google_drive", "camera", "dropbox"],
                showPoweredBy: false,
              }}
              onSuccess={(result, { widget }) => {
                const info = result.info;
                if (!info?.secure_url) {
                  console.error("No file info received from Cloudinary.");
                  return;
                }
                setIsUploading(true);
                setFileData({
                  name: `${info.original_filename}.pdf`,
                  url: info.secure_url,
                  publicId: info.public_id,
                });
                const fileData = {
                  name: `${info.original_filename}.pdf`,
                  url: info.secure_url,
                  publicId: info.public_id,
                };

                if (onUpload && typeof onUpload === "function") {
                  onUpload(fileData);
                }
                setError("");
                widget.close();
                console.log("Request Data:", fileData);
              }}
              onError={(uploadErr, { widget }) => {
                console.error("Upload error:", uploadErr);
                setError("Maximum file size is 200KB. Compress and try again.");
                setIsUploading(false);
                widget.close();
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  className="cv-uploadButton"
                  onClick={() => {
                    setError("");
                    open();
                  }}
                >
                  <span className="title">Upload PDF CV</span>
                  {error ? (
                    <span className="text-danger">{error}</span>
                  ) : (
                    <span className="text">Max 200 KB, PDF only</span>
                  )}
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>
      ) : (
        <div className="upload-success-message">
          <p className="text-success">
            CV uploaded successfully.&nbsp;
            {fileData?.url && (
              <a
                href={fileData.url}
                download={fileData.name}
                target="_blank"
                rel="noopener noreferrer"
                className="view-file-link"
              >
                View file
              </a>
            )}
          </p>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
              resourceType: "raw",
              clientAllowedFormats: ["pdf"],
              multiple: false,
              maxFileSize: 200 * 1024,
              folder: "pdfs",
              sources: ["local", "google_drive", "camera", "dropbox"],
              showPoweredBy: false,
            }}
            onSuccess={(result, { widget }) => {
              const info = result.info;
              setIsUploading(true);
              setFileData({
                name: `${info.original_filename}.pdf`,
                url: info.secure_url,
                publicId: info.public_id,
              });
              setError("");
              widget.close();
            }}
            onError={(uploadErr, { widget }) => {
              console.error("Upload error:", uploadErr);
              setError("Upload failed. Please try again.");
              setIsUploading(false);
              widget.close();
            }}
          >
            {({ open }) => (
              <button
                type="button"
                className="theme-btn btn-style-one mb-3 p-3  "
                onClick={() => {
                  setError("");
                  open();
                }}
              >
                Upload New CV (previous will be replaced)
              </button>
            )}
          </CldUploadWidget>
          {error && <p className="ui-danger mb-0">{error}</p>}
        </div>
      )}
    </>
  );
}
