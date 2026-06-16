import imageCompression from "browser-image-compression";

/**
 * Compress an image file to meet KYC requirements
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - The compressed file
 */
export async function compressImageForKYC(file, options = {}) {
  const {
    maxSizeMB = 1, // Max file size: 1 MB
    maxWidthOrHeight = 1920, // Max resolution: 1920px
    useWebWorker = true,
    fileType = "image/webp", // Use WebP for better compression
  } = options;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker,
      fileType,
    });

    return compressed;
  } catch (error) {
    console.error("Image compression failed:", error);
    throw new Error(`Image compression failed: ${error.message}`, {
      cause: error,
    });
  }
}

/**
 * Validate image file before compression
 * @param {File} file - The file to validate
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export function validateImageFile(file) {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxSizeMB = 50; // Allow larger files before compression

  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please use JPG, PNG, WEBP, or GIF.",
    };
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      error: `File is too large. Maximum ${maxSizeMB}MB allowed.`,
    };
  }

  return { valid: true, error: null };
}
