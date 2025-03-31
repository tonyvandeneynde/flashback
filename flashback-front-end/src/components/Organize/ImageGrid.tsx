import { CircularProgress, Typography, styled } from "@mui/material";
import { Gallery, Image } from "../../apiConstants";
import { ImageTile } from "./ImageTile";
import { useImageViewer } from "../../contexts/ImageViewerContext";
import { useAllImagesByGallery } from "../../services";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { useMultiselect } from "../../hooks";
import { useEffect } from "react";

const StyledGrid = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
`;

const Container = styled("div")`
  height: 100%;
  overflow-y: auto;
`;

export const ImageGrid = ({ gallery }: { gallery: Gallery }) => {
  const { openViewer } = useImageViewer();
  const {
    toggleSelectedImage,
    selectedImageIds,
    multiSelectImages,
    setImageIds,
  } = useOrganizeContext();

  const { images, status, error, isFetchingNextPage } = useAllImagesByGallery(
    gallery.id
  );

  useEffect(() => {
    setImageIds(images.map((image) => image.id));
  }, [images, setImageIds]);

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

  const handleImageClick = (imageId: number) => {
    if (isMultiselectActive) {
      multiSelectHandleClick(imageId);
    } else {
      toggleSelectedImage(imageId);
    }
  };

  if (status === "pending") {
    return <CircularProgress />;
  }

  if (status === "error") {
    return <Typography color="error">Error: {error?.message}</Typography>;
  }

  return (
    <Container>
      <StyledGrid onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex={0}>
        {images.map((image: Image) => (
          <div key={image.id}>
            <ImageTile
              image={image}
              isSelected={selectedImageIds.has(image.id)}
              onClick={() => handleImageClick(image.id)}
              onDoubleClick={() =>
                openViewer({ galleryId: gallery.id, initialImage: image })
              }
            />
          </div>
        ))}
      </StyledGrid>
      {isFetchingNextPage && <CircularProgress />}
    </Container>
  );
};
