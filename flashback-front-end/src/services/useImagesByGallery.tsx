import { useInfiniteQuery } from "@tanstack/react-query";
import { API_PREFIX, IMAGES_BY_GALLERY } from "../apiConstants";
import axios, { AxiosResponse } from "axios";
import { Image } from "../apiConstants";

export type PartialAxiosResponse<T> = Omit<
  AxiosResponse<T>,
  "config" | "headers"
>;

const fetchImagesByGallery = async ({
  galleryId,
  pageParam = 1,
}: {
  galleryId: number | null;
  pageParam?: number;
}): Promise<PartialAxiosResponse<Image[]>> => {
  if (!galleryId) {
    return {
      data: [],
      status: 200,
      statusText: "OK",
    };
  }

  const response = await axios.get(`${API_PREFIX}/${IMAGES_BY_GALLERY}`, {
    params: { galleryId, page: pageParam, limit: 40 },
  });
  return response.data;
};

export const useImagesByGallery = (galleryId: number | null) => {
  const queryResult = useInfiniteQuery({
    queryKey: [`${API_PREFIX}/${IMAGES_BY_GALLERY}/${galleryId}`],
    queryFn: async ({ pageParam = 1 }) =>
      fetchImagesByGallery({ galleryId, pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length === 0) {
        return undefined;
      }
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  return queryResult;
};
