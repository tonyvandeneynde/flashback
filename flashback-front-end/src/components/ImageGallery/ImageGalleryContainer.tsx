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
      {infiniteQueryData.data.pages[0].data.total === 0 && (
        <Typography textAlign={"center"} variant="body2" color="textPrimary">
          No images found in this gallery. Add some in Organize.
        </Typography>
      )}
      <ImageGallery
        infiniteQueryData={infiniteQueryData}
        onImageClick={handleImageClick}
      />
    </>
  );
};
