import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_PREFIX, IMAGES } from "../apiConstants";
import axios from "axios";
import { invalidateMapData } from "../utils/invalidateMapData";

const deleteImages = async ({ ids }: { ids: number[] }): Promise<any> => {
  const queryParams = new URLSearchParams();
  ids.forEach((id) => queryParams.append("ids", id.toString()));

  const response = await axios.delete(`/${API_PREFIX}/${IMAGES}`, {
    params: queryParams,
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
