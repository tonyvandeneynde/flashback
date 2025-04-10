import { useInfiniteQuery } from "@tanstack/react-query";
import { API_PREFIX, IMAGES } from "../apiConstants";
import axios, { AxiosResponse } from "axios";
import { Image } from "../apiConstants";

const fetchImages = async ({
  pageParam = 1,
}: {
  pageParam?: number;
}): Promise<AxiosResponse<Image[]>> => {
  const response = await axios.get(`/${API_PREFIX}/${IMAGES}`, {
    params: { page: pageParam, limit: 40 },
  });
  return response.data;
};

export const useImages = () => {
  const queryResult = useInfiniteQuery({
    queryKey: [`/${API_PREFIX}/${IMAGES}`],
    queryFn: async ({ pageParam = 1 }) => fetchImages({ pageParam }),
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
