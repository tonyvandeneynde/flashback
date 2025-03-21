import { useEffect, useState } from "react";
import { useImagesByGallery } from "./useImagesByGallery";
import { Image } from "../apiConstants";

// This hook fetches all images of a gallery in a paginated way so that
// the first page is fetched and those images are available immediately. The others follow.
export const useAllImagesByGallery = (galleryId: number) => {
  const [images, setImages] = useState<Image[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useImagesByGallery(galleryId);

  useEffect(() => {
    if (data) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
      setImages(data.pages.flatMap((page) => page.data));
    }
  }, [data, fetchNextPage]);

  return {
    images,
    status,
    error,
    isFetchingNextPage,
  };
};
