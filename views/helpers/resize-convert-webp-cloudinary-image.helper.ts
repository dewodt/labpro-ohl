export function resizeConvertWebpCloudinaryImage(
  imageUrl: string,
  width?: number,
  height?: number,
) {
  // No resize
  if (!width && !height) {
    return `${imageUrl.replace('upload/', `upload/f_webp/`)}`;
  }

  // No height = auto
  if (width && !height) {
    return `${imageUrl.replace('upload/', `upload/w_${width},f_webp/`)}`;
  }

  // No width = auto
  if (!width && height) {
    return `${imageUrl.replace('upload/', `upload/h_${height},f_webp/`)}`;
  }

  // Fill such that the image will be resized to fit completely within the specified dimensions
  return `${imageUrl.replace(
    'upload/',
    `upload/w_${width},h_${height},c_fill,f_webp/`,
  )}`;
}
