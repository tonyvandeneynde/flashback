import { API_PREFIX, IMAGES } from "../apiConstants";
import axios, { CancelTokenSource } from "axios";

export const useUploadImage = () => {
  const uploadImage = async ({
    galleryId,
    file,
    uploadId,
    onProgress,
    onUploaded,
    onError,
    onCanceled,
    cancelTokenSource,
  }: {
    galleryId: number;
    file: File;
    uploadId: string;
    onProgress: (progress: number) => void;
    onError: (error: any) => void;
    onUploaded: () => void;
    onCanceled: () => void;
    cancelTokenSource: CancelTokenSource;
  }) => {
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("uploadId", uploadId);
      formData.append("galleryId", galleryId.toString());

      const response = await axios.post(`${API_PREFIX}/${IMAGES}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          onProgress(progressEvent.progress ?? 0);
        },
        cancelToken: cancelTokenSource.token,
      });

      if (response.status === 201) {
        onUploaded();
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error: any) {
      if (axios.isCancel(error)) {
        onCanceled();
      } else {
        onError(error);
      }
    }
  };
  return { uploadImage };
};
