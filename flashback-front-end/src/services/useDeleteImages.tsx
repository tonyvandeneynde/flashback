import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_PREFIX, IMAGES, IMAGES_DELETE } from "../apiConstants";
import axios from "axios";
import { invalidateMapData } from "../utils/invalidateMapData";

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
      invalidateMapData();
    },
  });

  return mutation;
};
