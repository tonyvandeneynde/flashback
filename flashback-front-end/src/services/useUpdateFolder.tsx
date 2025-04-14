import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  API_PREFIX,
  Folder,
  FOLDER_MAP_DATA,
  FOLDERS,
  FOLDERS_UPDATE,
  GALLERY_MAP_DATA,
} from "../apiConstants";
import axios from "axios";

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
  let url = `/${API_PREFIX}/${FOLDERS_UPDATE}`;

  const response = await axios.put(url, {
    id,
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
