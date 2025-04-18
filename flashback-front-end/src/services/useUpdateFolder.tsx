import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_PREFIX, Folder, FOLDERS } from "../apiConstants";
import axios from "axios";
import { invalidateMapData } from "../utils/invalidateMapData";

const updateFolder = async ({
  id,
  name,
  parentId,
  showMapInFolder,
}: {
  id: number;
  parentId?: number;
  name?: string;
  showMapInFolder?: boolean;
}): Promise<Folder> => {
  let url = `/${API_PREFIX}/${FOLDERS}/${id}`;

  const response = await axios.put(url, {
    name,
    parentId,
    showMapInFolder,
  });
  return response.data;
};

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/${API_PREFIX}/${FOLDERS}`],
      });
      invalidateMapData();
    },
  });

  return mutation;
};
