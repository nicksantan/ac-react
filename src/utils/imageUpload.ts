import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * Upload an image to Firebase Storage and return the download URL
 * @param file - The file to upload
 * @param context - Context for the filename (e.g., 'games-arcadeCabinets-gameKey')
 * @returns The download URL of the uploaded image
 */
export async function uploadImage(file: File, context: string): Promise<string> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file');
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image must be less than 5MB');
  }

  // Create a unique filename with context prefix
  const timestamp = Date.now();
  const sanitizedContext = context.replace(/\//g, '-');
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${sanitizedContext}-${timestamp}-${sanitizedName}`;
  // Upload to images/ folder to match existing storage rules
  const imageRef = storageRef(storage, `images/${filename}`);

  // Upload file
  await uploadBytes(imageRef, file);

  // Get and return download URL
  const downloadUrl = await getDownloadURL(imageRef);
  return downloadUrl;
}
