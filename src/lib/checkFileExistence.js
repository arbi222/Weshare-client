import { storage } from "./firebase";
import { ref, getMetadata } from "firebase/storage";

const checkIfFileExists = async (downloadURL) => {
  try {
    const decodedPath = decodeURIComponent(downloadURL.split("/o/")[1].split("?")[0]);

    const fileRef = ref(storage, decodedPath);

    await getMetadata(fileRef);

    return true;
  } catch (error) {
    if (error.code === "storage/object-not-found") {
      return false;
    }
  }
};

export default checkIfFileExists;