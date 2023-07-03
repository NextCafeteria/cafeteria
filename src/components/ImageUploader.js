import { useState } from "react";
import dbService from "@/services/Database";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { uuidv4 } from "@/lib/utils";

export default function ImageUploader({
  styles,
  handleUploadStart,
  handleUploadSuccess,
  handleUploadProgress,
}) {
  const [isUploading, setIsUploading] = useState(false);

  function openFilePicker() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = function () {
      uploadImage(this);
    };
    input.click();
  }

  function uploadImage(input) {
    const file = input.files[0];
    const fileType = file.type;
    const fileSize = file.size;
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 1024 * 1024; // 1MB
    if (!allowedTypes.includes(fileType)) {
      alert("Invalid file type. Only JPEG and PNG image files are allowed");
    } else if (fileSize > maxSize) {
      alert("File size too large. Only files up to 1MB are allowed");
    } else {
      handleUploadStart();
      setIsUploading(true);

      const fileExtension = file.name.split(".").pop();
      const storageRef = ref(
        dbService.getStorage(),
        `images/${uuidv4()}.${fileExtension}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          handleUploadProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setIsUploading(false);
            handleUploadSuccess(url);
          });
        }
      );
    }
  }

  return (
    <button
      className={`flex justify-center ${styles}`}
      onClick={() => openFilePicker()}
      disabled={isUploading}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
    </button>
  );
}
