import { useEffect, useState } from "react";
import { useUploadImage } from "../services";
import {
  StatusUpdate,
  useImageProcessingStatus,
} from "./useImageProcessingStatus";
import axios, { CancelTokenSource } from "axios";

export type FileState =
  | "queued"
  | "uploading"
  | "uploaded"
  | "processing"
  | "done"
  | "uploadError"
  | "processingError"
  | "cancelled";

export interface FileUploadState {
  file: File;
  UploadProgress: number;
  state: FileState;
}

export const useUploadImages = ({ galleryId }: { galleryId: number }) => {
  const { uploadImage } = useUploadImage();
  const maxSimultaneousUploads = 3;
  const [fileStates, setFileStates] = useState<FileUploadState[]>([]);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [cancelTokens, setCancelTokens] = useState<CancelTokenSource[]>([]);

  const onProcessingStatusUpdate = (status: StatusUpdate) => {
    const file = fileStates.find(
      (state) => state.file.name === status.imageName
    );
    if (!file) return;

    let newState: FileState = "processing";

    if (status.status === "success") {
      newState = "done";
    } else if (status.status === "fail") {
      newState = "processingError";
    }

    handleStateChange(file, newState);
  };

  const { setUploadId: setUploadIdForProcessingStatusUpdates } =
    useImageProcessingStatus({
      onStatusUpdate: onProcessingStatusUpdate,
    });

  const handleUploadProgress = (file: FileUploadState, progress: number) => {
    setFileStates((prevFileStates) => {
      const newFileStates = [...prevFileStates];
      const fileIndex = newFileStates.findIndex((f) => f.file === file.file);
      newFileStates[fileIndex].UploadProgress = progress;
      return newFileStates;
    });
  };

  const handleStateChange = (file: FileUploadState, state: FileState) => {
    setFileStates((prevFileStates) => {
      const newFileStates = [...prevFileStates];
      const fileIndex = newFileStates.findIndex((f) => f.file === file.file);
      newFileStates[fileIndex].state = state;
      return newFileStates;
    });
    if (state === "uploaded" || state === "uploadError") {
      startNextUpload();
    }
  };

  const handleCancelUpload = () => {
    setFileStates((prevFileStates) => {
      const newFileStates = [...prevFileStates];
      newFileStates.forEach((fileState) => {
        if (fileState.state === "queued") {
          fileState.state = "cancelled";
        }
        for (const cancelToken of cancelTokens) {
          cancelToken.cancel();
        }
      });
      return newFileStates;
    });
  };

  const startUpload = (fileState: FileUploadState) => {
    if (!uploadId) {
      return;
    }

    const cancelTokenSource = axios.CancelToken.source();
    setCancelTokens((prevTokens) => [...prevTokens, cancelTokenSource]);

    uploadImage({
      galleryId,
      file: fileState.file,
      uploadId,
      onProgress: (progress) => handleUploadProgress(fileState, progress),
      onError: () => handleStateChange(fileState, "uploadError"),
      onUploaded: () => handleStateChange(fileState, "uploaded"),
      onCanceled: () => handleStateChange(fileState, "cancelled"),
      cancelTokenSource,
    });
    handleStateChange(fileState, "uploading");
  };

  const startNextUpload = () => {
    const nextFile = fileStates.find(
      (fileState) => fileState.state === "queued"
    );
    if (nextFile) {
      startUpload(nextFile);
    }
  };

  useEffect(() => {
    if (!uploadId) {
      return;
    }

    if (fileStates[0]?.state === "queued") {
      // Start the first uploads
      for (
        let i = 0;
        i < maxSimultaneousUploads && i < fileStates.length;
        i++
      ) {
        fileStates[i].state === "queued" && startUpload(fileStates[i]);
      }
    }
  }, [fileStates, uploadId]);

  const uploadImages = async ({ files }: { files: File[] }) => {
    const uploadId = galleryId.toString() + "-" + Date.now();
    setUploadId(uploadId);
    setUploadIdForProcessingStatusUpdates(uploadId);

    const fileStates = files.map((file) => ({
      file,
      UploadProgress: 0,
      error: false,
      state: "queued" as FileState,
    }));
    setFileStates(fileStates);
  };

  return { uploadImages, fileStates, cancelUploads: handleCancelUpload };
};
