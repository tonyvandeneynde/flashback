import { CircularProgress, styled } from "@mui/material";
import { Image } from "../../apiConstants";
import { ImageTile } from "./ImageTile";
import { useImageViewer } from "../../contexts/ImageViewerContext";

const StyledGrid = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
`;

const Container = styled("div")`
  height: 100%;
  overflow-y: auto;
`;

export const ImageGrid = ({
  images,
  galleryId,
  onKeyDown,
  onKeyUp,
  onImageClick,
  selectedImageIds,
  isFetchingNextPage,
}: {
  images: Image[];
  galleryId: number;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
  onImageClick?: (imageId: number) => void;
  selectedImageIds?: Set<number>;
  isFetchingNextPage?: boolean;
}) => {
  const { openViewer } = useImageViewer();

  return (
    <Container>
      <StyledGrid onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={0}>
        {images.map((image: Image) => (
          <div key={image.id}>
            <ImageTile
              image={image}
              isSelected={selectedImageIds?.has(image.id)}
              onClick={() => onImageClick?.(image.id)}
              onDoubleClick={() =>
                openViewer({ galleryId: galleryId, initialImage: image })
              }
            />
          </div>
        ))}
      </StyledGrid>
      {isFetchingNextPage && <CircularProgress />}
    </Container>
  );
};
