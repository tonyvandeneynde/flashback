import React, { useEffect } from "react";
import { Grid, CircularProgress, Typography } from "@mui/material";
import { Image } from "../../apiConstants";
import { InfiniteData } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { UseInfiniteQueryResult } from "@tanstack/react-query";

type ImageGalleryProps = UseInfiniteQueryResult<
  InfiniteData<AxiosResponse<Image[], any>, unknown>,
  Error
>;

const ImageGallery = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
  error,
}: ImageGalleryProps) => {
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop <
      document.documentElement.offsetHeight - 50
    )
      return;
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
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
      <Grid container spacing={2}>
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((image: Image) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                <img
                  src={image.mediumPath}
                  alt={image.filename}
                  style={{ width: "100%" }}
                />
                <Typography>{image.filename}</Typography>
              </Grid>
            ))}
          </React.Fragment>
        ))}
      </Grid>
      {isFetchingNextPage && <CircularProgress />}
    </div>
  );
};

export default ImageGallery;
