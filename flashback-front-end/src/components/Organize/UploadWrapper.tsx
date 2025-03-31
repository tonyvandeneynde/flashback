import { API_PREFIX, Gallery, IMAGES_BY_GALLERY } from "../../apiConstants";
import { useDropzone } from "react-dropzone";
import { ReactNode, useState } from "react";
import { Button, styled } from "@mui/material";
import { useUploadImages } from "../../hooks/useUploadImages";
import { UploadProgressDialog } from "./UploadProgressDialog";
import { useQueryClient } from "@tanstack/react-query";

const StyledUploadButtonContainer = styled("div")`
  margin-bottom: 8px;
`;

const StyledDropZone = styled("div")`
  border: 2px dashed #cccccc;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
`;

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
    onDrop,
    noClick: true,
  });

  const handleDialogClose = () => {
    queryClient.invalidateQueries({
      queryKey: [`${API_PREFIX}/${IMAGES_BY_GALLERY}/${gallery.id}`],
    });
    setIsUploadDialogOpen(false);
  };

  const handleRetry = () => {
    const failedFiles = fileStates.filter(
      (file) => file.state === "processingError" || file.state === "uploadError"
    );
    uploadImages({ files: failedFiles.map((file) => file.file) });
    setIsUploadDialogOpen(true);
  };

  return (
    <>
      <UploadProgressDialog
        open={isUploadDialogOpen}
        fileStates={fileStates}
        onClose={handleDialogClose}
        onRetry={handleRetry}
        onCancel={cancelUploads}
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
