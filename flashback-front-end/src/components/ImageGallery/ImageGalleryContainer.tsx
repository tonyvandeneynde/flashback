import { CircularProgress, styled, Typography } from "@mui/material";
import { useImagesByGallery } from "../../services";
import { ImageGallery } from "./ImageGallery";
import { Image } from "../../apiConstants";
import { useImageViewer } from "../../contexts/ImageViewerContext";

const StyledCircularProgress = styled(CircularProgress)`
  margin: auto;
`;

export const ImageGalleryContainer = ({ galleryId }: { galleryId: number }) => {
  const infiniteQueryData = useImagesByGallery(galleryId);
  const { openViewer } = useImageViewer();

  const { status, error } = infiniteQueryData;

  const handleImageClick = (image: Image) => {
    openViewer({
      galleryId,
      initialImage: image,
    });
  };

  if (status === "pending") {
    return <StyledCircularProgress />;
  }

  if (status === "error") {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <>
      <ImageGallery
        infiniteQueryData={infiniteQueryData}
        onImageClick={handleImageClick}
      />
    </>
  );
};
