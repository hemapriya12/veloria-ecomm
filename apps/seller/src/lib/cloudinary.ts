/**
 * Shared Cloudinary upload utility for the seller app.
 * Previously duplicated in 3 files — now imported from here.
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ecommerce");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  if (!data.secure_url) throw new Error(data.error?.message || "Upload failed");
  return data.secure_url as string;
};
