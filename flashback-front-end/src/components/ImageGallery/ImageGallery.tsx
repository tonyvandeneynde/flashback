import { useEffect, useState } from "react";
import { CircularProgress, styled } from "@mui/material";
import { Image } from "../../apiConstants";
import { ImageTile } from "./ImageTile";
import { ImagesByGalleryResponse, PartialAxiosResponse } from "../../services";
import { ScrollToTopButton } from "./ScrollToTopButton";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";

const StyledRow = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
  width: 100%;
  margin-left: 8px;
`;

const StyledImageWrapper = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const StyledGallery = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  margin: 8px 0;
`;

interface Row {
  images: Image[];
  height: number;
}

interface ImageGalleryProps {
  infiniteQueryData: UseInfiniteQueryResult<
    InfiniteData<PartialAxiosResponse<ImagesByGalleryResponse>, unknown>,
    Error
  >;
  onImageClick: (image: Image) => void;
}

export const ImageGallery = ({
  infiniteQueryData,
  onImageClick,
}: ImageGalleryProps) => {
  const [rows, setRows] = useState<Row[]>([]);
  const maxRowHeight = 250;
  const gap = 8;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    infiniteQueryData;

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - maxRowHeight) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  const handleResize = () => {
    if (data) {
      const allImages = data.pages.flatMap((page) => page.data.images);
      const newRows: Row[] = [];
      let currentRow: Row = { images: [], height: maxRowHeight };
      let currentRowWidth = 0;
      const maxRowWidth = window.innerWidth - 16; // left and right margin of 8px

      allImages.forEach((image) => {
        const [originalImageHeight, originalImageWidth] = [5, 6, 7, 8].includes(
          image.orientation
        )
          ? [image.width, image.height]
          : [image.height, image.width]; // Swap width and height if orientation is 90 or 270 degrees

        const aspectRatio = originalImageWidth / originalImageHeight;
        const imageWidth = maxRowHeight * aspectRatio; // Base height of 150px
        currentRow.images.push(image);

        currentRowWidth += imageWidth + gap; // Add gap

        if (currentRowWidth > maxRowWidth) {
          // Row is full, calculate new height for images to fit in row width

          const newHeight =
            maxRowHeight /
            ((currentRowWidth - currentRow.images.length * gap) /
              (maxRowWidth - (currentRow.images.length - 1) * gap));
          currentRow.height = newHeight;

          newRows.push(currentRow);

          currentRow = { images: [], height: maxRowHeight };
          currentRowWidth = 0;
        }
      });

      if (currentRow.images.length > 0) {
        newRows.push(currentRow);
      }

      setRows(newRows);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call to set rows based on initial window size

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [data, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <StyledGallery>
        {rows.map((row, rowIndex) => (
          <StyledRow key={rowIndex}>
            {row.images.map((image: Image) => (
              <StyledImageWrapper key={image.id}>
                <ImageTile
                  imageSrc={image.mediumPath}
                  alt={image.name}
                  height={row.height}
                  onDoubleClick={() => onImageClick(image)}
                />
              </StyledImageWrapper>
            ))}
          </StyledRow>
        ))}
        {isFetchingNextPage && <CircularProgress />}
        <ScrollToTopButton />
      </StyledGallery>
    </>
  );
};
