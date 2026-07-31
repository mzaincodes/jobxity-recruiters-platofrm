export const openCloudinaryWidget = (callback) => {
    if (typeof window === 'undefined' || !window.cloudinary) return;
  
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
        resourceType: 'raw',
        multiple: false,
        maxFileSize: 200 * 1024, // 1MB
        clientAllowedFormats: ['pdf'],
      },
      (error, result) => {
        if (!error && result.event === 'success') {
          callback(result.info);
        }
      }
    );
  
    widget.open();
  };
  