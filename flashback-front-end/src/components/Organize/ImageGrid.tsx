import React, { useEffect } from "react";
import { CircularProgress, Typography, styled } from "@mui/material";
import { Image } from "../../apiConstants";
import { InfiniteData } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { ImageTile } from "./ImageTile";

type ImageGalleryProps = UseInfiniteQueryResult<
  InfiniteData<AxiosResponse<Image[], any>, unknown>,
  Error
> & {
  toggleSelectedImage: (image: Image) => void;
  selectedImages: Image[];
};

const StyledGrid = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
`;

export const ImageGrid = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
  error,
  selectedImages,
  toggleSelectedImage,
}: ImageGalleryProps) => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 50) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage]);

  if (status === "pending") {
    return <CircularProgress />;
  }

  if (status === "error") {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <div>
      <StyledGrid>
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((image: Image) => (
              <div key={image.id}>
                <ImageTile
                  image={image}
                  isSelected={selectedImages.includes(image)}
                  onClick={() => toggleSelectedImage(image)}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </StyledGrid>
      {isFetchingNextPage && <CircularProgress />}
    </div>
  );
};
