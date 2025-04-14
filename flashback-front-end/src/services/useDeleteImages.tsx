import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  API_PREFIX,
  FOLDER_MAP_DATA,
  GALLERY_MAP_DATA,
  IMAGES,
  IMAGES_DELETE,
} from "../apiConstants";
import axios from "axios";

const deleteImages = async ({ ids }: { ids: number[] }): Promise<any> => {
  const response = await axios.post(`/${API_PREFIX}/${IMAGES_DELETE}`, {
    ids,
  });
  return response.data;
};

export const useDeleteImages = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteImages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/${API_PREFIX}/${IMAGES}`] });
      queryClient.invalidateQueries({
        queryKey: [`/${API_PREFIX}/${GALLERY_MAP_DATA}/`],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [`/${API_PREFIX}/${FOLDER_MAP_DATA}/`],
        exact: false,
      });
    },
  });

  return mutation;
};
