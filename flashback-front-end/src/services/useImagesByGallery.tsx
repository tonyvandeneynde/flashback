import { useInfiniteQuery } from "@tanstack/react-query";
import { API_PREFIX, IMAGES_BY_GALLERY } from "../apiConstants";
import axios, { AxiosResponse } from "axios";
import { Image } from "../apiConstants";

const fetchImagesByGallery = async ({
  galleryId,
  pageParam = 1,
}: {
  galleryId: number;
  pageParam?: number;
}): Promise<AxiosResponse<Image[]>> => {
  const response = await axios.get(`${API_PREFIX}/${IMAGES_BY_GALLERY}`, {
    params: { galleryId, page: pageParam, limit: 20 },
  });
  return response.data;
};

export const useImagesByGallery = (galleryId: number) => {
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
