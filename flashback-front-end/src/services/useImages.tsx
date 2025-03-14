import { useQuery } from "@tanstack/react-query";
import { API_PREFIX, IMAGES } from "../apiConstants";

export interface Image {
  id: number;
  filename: string;
  originalPath: string;
  mediumPath: string;
  thumbnailPath: string;
  tags: string[];
}

export const useImages = () => {
  const queryResult = useQuery<Image[]>({
    queryKey: [`${API_PREFIX}/${IMAGES}`],
  });

  return queryResult;
};
