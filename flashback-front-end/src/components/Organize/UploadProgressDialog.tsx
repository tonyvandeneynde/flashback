import { Dialog, DialogTitle } from "@mui/material";
import { FileUploadState } from "../../hooks/useUploadImages";
import { UploadDialogContent } from "./UploadDialogContent";
import { UploadFinishedDialogContent } from "./UploadFinishedDialogContent";
import { useEffect } from "react";

const filesByStates = (fileStates: FileUploadState[]) => {
  return fileStates.reduce(
    (acc, state) => {
      if (state.state === "queued") {
        acc.queuedFiles.push(state);
      } else if (
        state.state === "uploading" ||
        state.state === "processing" ||
        state.state === "uploaded"
      ) {
        acc.inProgressFiles.push(state);
      } else if (state.state === "done") {
        acc.doneFiles.push(state);
      } else if (
        state.state === "uploadError" ||
        state.state === "processingError"
      ) {
        acc.failedFiles.push(state);
      } else if (state.state === "cancelled") {
        acc.cancelledFiles.push(state);
      }
      return acc;
    },
    {
      queuedFiles: [] as FileUploadState[],
      inProgressFiles: [] as FileUploadState[],
      doneFiles: [] as FileUploadState[],
      failedFiles: [] as FileUploadState[],
      cancelledFiles: [] as FileUploadState[],
    }
  );
};

export const UploadProgressDialog = ({
  open,
  onClose,
  fileStates,
  onRetry,
  onCancel,
}: {
  open: boolean;
  onClose: () => void;
  onRetry: () => void;
  onCancel: () => void;
  fileStates: FileUploadState[];
}) => {
  const {
    doneFiles,
    failedFiles,
    inProgressFiles,
    queuedFiles,
    cancelledFiles,
  } = filesByStates(fileStates);

  const leftColumnFileStates = [
    ...failedFiles,
    ...inProgressFiles,
    ...cancelledFiles,
    ...queuedFiles,
  ];

  const numberOfFailedFiles = failedFiles.length;
  const numberOfDoneFiles = doneFiles.length;

  const uploadFinished =
    numberOfFailedFiles + numberOfDoneFiles === fileStates.length;

  useEffect(() => {
    if (
      cancelledFiles.length > 0 &&
      doneFiles.length + failedFiles.length + cancelledFiles.length ===
        fileStates.length
    ) {
      // Upload was cancelled by user and all files are either done, failed or cancelled
      onClose();
    }
  }, [cancelledFiles, doneFiles, failedFiles, fileStates, onClose]);

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>
        {uploadFinished ? "Upload finished" : "Uploading images..."}
      </DialogTitle>
      {uploadFinished ? (
        <UploadFinishedDialogContent
          numberOfDoneFiles={numberOfDoneFiles}
          failedFiles={failedFiles.map((file) => file.file)}
          uploadFinished={uploadFinished}
          onClose={onClose}
          onRetry={onRetry}
        />
      ) : (
        <UploadDialogContent
          leftColumnFileStates={leftColumnFileStates}
          rightColumnFileStates={doneFiles}
          numberOfDoneFiles={numberOfDoneFiles}
          numberOfFailedFiles={numberOfFailedFiles}
          onCancel={onCancel}
        />
      )}
    </Dialog>
  );
};
