import { API_PREFIX, Gallery, IMAGES_BY_GALLERY } from "../../apiConstants";
import { useDropzone, FileError as DropzoneFileError } from "react-dropzone";
import { ReactNode, useState } from "react";
import { Button, styled } from "@mui/material";
import { useUploadImages } from "../../hooks/useUploadImages";
import { UploadProgressDialog } from "./UploadProgressDialog";
import { useQueryClient } from "@tanstack/react-query";
import { invalidateMapData } from "../../utils/invalidateMapData";

const StyledUploadButtonContainer = styled("div")`
  margin-bottom: 8px;
`;

const StyledDropZone = styled("div")`
  border: 2px dashed #cccccc;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
`;

interface CustomFileError extends DropzoneFileError {
  message: string;
}

const validateFileType = <T extends File>(
  file: T
): CustomFileError | readonly CustomFileError[] | null => {
  const validTypes = ["image/jpeg", "image/png"];
  if (!validTypes.includes(file.type)) {
    return {
      code: "file-invalid-type",
      message: "Only JPEG and PNG files are supported",
    };
  }
  return null;
};

export const ImageGalleryUploadWrapper = ({
  children,
  gallery,
}: {
  children: ReactNode;
  gallery: Gallery;
}) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { uploadImages, fileStates, cancelUploads } = useUploadImages({
    galleryId: gallery.id,
  });
  const queryClient = useQueryClient();

  const onDrop = async (acceptedFiles: File[]) => {
    uploadImages({ files: acceptedFiles });
    setIsUploadDialogOpen(true);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    maxSize: 20 * 1024 * 1024, // 20MB
    validator: validateFileType,
    onDrop,
    noClick: true,
  });

  const handleDialogClose = () => {
    queryClient.invalidateQueries({
      queryKey: [`/${API_PREFIX}/${IMAGES_BY_GALLERY}/`, gallery.id],
    });
    invalidateMapData();
    setIsUploadDialogOpen(false);
  };

  const handleRetry = () => {
    const failedFiles = fileStates.filter(
      (file) => file.state === "processingError" || file.state === "uploadError"
    );
    uploadImages({ files: failedFiles.map((file) => file.file) });
    setIsUploadDialogOpen(true);
  };

  const handleCancel = () => {
    cancelUploads();
    handleDialogClose();
  };

  return (
    <>
      <UploadProgressDialog
        open={isUploadDialogOpen}
        fileStates={fileStates}
        onClose={handleDialogClose}
        onRetry={handleRetry}
        onCancel={handleCancel}
      />
      <StyledUploadButtonContainer>
        <Button onClick={open}>Browse files</Button>
        to upload or drop below
      </StyledUploadButtonContainer>
      <StyledDropZone {...getRootProps()}>
        <input {...getInputProps()} />
        {children}
      </StyledDropZone>
    </>
  );
};
