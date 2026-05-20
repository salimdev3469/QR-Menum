import imageCompression from "browser-image-compression";

import { IMAGE_LIMITS } from "@/lib/constants";

export async function compressImageClient(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: IMAGE_LIMITS.MAX_SIZE_MB,
    maxWidthOrHeight: IMAGE_LIMITS.MAX_WIDTH_OR_HEIGHT,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.8,
  });
}
