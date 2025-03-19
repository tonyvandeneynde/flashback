import React, { useEffect, useRef } from "react";
import { CircularProgress, Typography, styled } from "@mui/material";
import { Gallery, Image } from "../../apiConstants";
import { ImageTile } from "./ImageTile";
import { useImageViewer } from "../../contexts/ImageViewerContext";
import { useImagesByGallery } from "../../services";
import { useOrganizeContext } from "../../contexts/OrganizeContext";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { openViewer } = useImageViewer();
  const { toggleSelectedImage, selectedImages } = useOrganizeContext();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useImagesByGallery(gallery.id);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 50) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [hasNextPage, isFetchingNextPage]);

  if (status === "pending") {
    return <CircularProgress />;
  }

  if (status === "error") {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <Container ref={containerRef}>
      <StyledGrid>
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((image: Image) => (
              <div key={image.id}>
                <ImageTile
                  image={image}
                  isSelected={selectedImages.includes(image)}
                  onClick={() => toggleSelectedImage(image)}
                  onDoubleClick={() =>
                    openViewer({ galleryId: gallery.id, initialImage: image })
                  }
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </StyledGrid>
      {isFetchingNextPage && <CircularProgress />}
    </Container>
  );
};
