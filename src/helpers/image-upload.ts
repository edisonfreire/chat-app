import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// https://firebase.google.com/docs/storage/web/upload-files
import firebaseApp from "@/config/firebase-config";

export const UploadImageToFirebaseAndReturnUrl = async (file: File) => {
  try {
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadedImageResponse = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadedImageResponse.ref);
    return downloadURL;
  } catch (error:any) {
    throw new Error(error.message);
  }
}