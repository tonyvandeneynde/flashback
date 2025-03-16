import { Gallery } from "../../apiConstants";
import { useDropzone } from "react-dropzone";
import { ReactNode } from "react";
import { Button, styled } from "@mui/material";
import { useUploadImages } from "../../services/useUploadImages";

const StyledUploadButtonContainer = styled("div")`
  margin-bottom: 8px;
`;

const StyledDropZone = styled("div")`
  border: 2px dashed #cccccc;
  padding: 20px;
`;

export const ImageGalleryUploadWrapper = ({
  children,
  gallery,
}: {
  children: ReactNode;
  gallery: Gallery;
}) => {
  const { uploadImages } = useUploadImages();

  const onDrop = async (acceptedFiles: File[]) => {
    uploadImages(gallery.id, acceptedFiles);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <div>
      <StyledUploadButtonContainer>
        <Button onClick={open}>Browse files</Button>
        to upload or drop below
      </StyledUploadButtonContainer>
      <StyledDropZone {...getRootProps()}>
        <input {...getInputProps()} />
        {children}
      </StyledDropZone>
    </div>
  );
};
