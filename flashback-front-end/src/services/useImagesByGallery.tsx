import { useInfiniteQuery } from "@tanstack/react-query";
import { API_PREFIX, IMAGES_BY_GALLERY } from "../apiConstants";
import axios, { AxiosResponse } from "axios";
import { Image } from "../apiConstants";

export type PartialAxiosResponse<T> = Omit<
  AxiosResponse<T>,
  "config" | "headers"
>;

export interface ImagesByGalleryResponse {
  images: Image[];
  total: number;
}

const fetchImagesByGallery = async ({
  galleryId,
  pageParam = 1,
}: {
  galleryId: number | null;
  pageParam?: number;
}): Promise<PartialAxiosResponse<ImagesByGalleryResponse>> => {
  if (!galleryId) {
    return {
      data: { images: [], total: 0 },
      status: 200,
      statusText: "OK",
    };
  }

  const response = await axios.get(`/${API_PREFIX}/${IMAGES_BY_GALLERY}`, {
    params: { galleryId, page: pageParam, limit: 40 },
  });

  return {
    data: {
      images: response.data.data,
      total: response.data.total,
    },
    status: response.status,
    statusText: response.statusText,
  };
};

export const useImagesByGallery = (galleryId: number | null) => {
  const queryResult = useInfiniteQuery({
    queryKey: [`/${API_PREFIX}/${IMAGES_BY_GALLERY}/${galleryId}`],
    queryFn: async ({ pageParam = 1 }) =>
      fetchImagesByGallery({ galleryId, pageParam }),
    getNextPageParam: (lastPage, pages, limit) => {
      if (lastPage.data.images?.length < limit) {
        return undefined;
      }
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  return queryResult;
};
