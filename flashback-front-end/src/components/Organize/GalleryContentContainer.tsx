import { CircularProgress, styled, Typography } from "@mui/material";
import { Gallery } from "../../apiConstants";
import { ImageGrid } from "./ImageGrid";
import { ImageGalleryUploadWrapper } from "./UploadWrapper";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { useAllImagesByGallery } from "../../services";
import { useEffect } from "react";
import { useMultiselect } from "../../hooks";

const StyledImageGalleryUploadWrapper = styled(ImageGalleryUploadWrapper)`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

export const GalleryContentContainer = ({ gallery }: { gallery: Gallery }) => {
  const { images, status, error, isFetchingNextPage } = useAllImagesByGallery(
    gallery.id
  );

  const {
    toggleSelectedImage,
    selectedImageIds,
    multiSelectImages,
    setImageIds,
  } = useOrganizeContext();

  const {
    handleImageClick: multiSelectHandleClick,
    handleKeyDown,
    handleKeyUp,
    isMultiselectActive,
  } = useMultiselect({
    images,
    selectedImageIds: [...selectedImageIds],
    multiSelectImages,
  });

  useEffect(() => {
    setImageIds(images.map((image) => image.id));
  }, [images, setImageIds]);

  if (status === "pending") {
    return <CircularProgress />;
  }

  if (status === "error") {
    return <Typography color="error">Error: {error?.message}</Typography>;
  }

  const handleImageClick = (imageId: number) => {
    if (isMultiselectActive) {
      multiSelectHandleClick(imageId);
    } else {
      toggleSelectedImage(imageId);
    }
  };

  return (
    <StyledImageGalleryUploadWrapper gallery={gallery}>
      <ImageGrid
        galleryId={gallery.id}
        images={images}
        isFetchingNextPage={isFetchingNextPage}
        onImageClick={handleImageClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        selectedImageIds={selectedImageIds}
      />
    </StyledImageGalleryUploadWrapper>
  );
};
