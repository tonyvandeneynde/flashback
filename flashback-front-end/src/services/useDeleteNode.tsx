import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  API_PREFIX,
  Folder,
  FOLDERS,
  FOLDERS_GALLERIES,
} from "../apiConstants";
import axios from "axios";
import { invalidateMapData } from "../utils/invalidateMapData";

const deleteFolder = async ({
  id,
  type,
}: {
  id: number;
  type: "folder" | "gallery";
}): Promise<Folder> => {
  const deletePath = type === "folder" ? FOLDERS : FOLDERS_GALLERIES;
  const url = `/${API_PREFIX}/${deletePath}/${id}`;

  const response = await axios.delete(url);
  return response.data;
};

export const useDeleteNode = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/${API_PREFIX}/${FOLDERS}`],
      });
      invalidateMapData();
    },
  });

  return mutation;
};
