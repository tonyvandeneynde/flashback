import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  API_PREFIX,
  Folder,
  FOLDER_MAP_DATA,
  FOLDERS,
  FOLDERS_DELETE,
  FOLDERS_DELETE_GALLERY,
  GALLERY_MAP_DATA,
} from "../apiConstants";
import axios from "axios";

const deleteFolder = async ({
  id,
  type,
}: {
  id: number;
  type: "folder" | "gallery";
}): Promise<Folder> => {
  let url = `/${API_PREFIX}/`;
  if (type === "folder") {
    url += FOLDERS_DELETE;
  } else {
    url += FOLDERS_DELETE_GALLERY;
  }

  const response = await axios.delete(url, {
    params: { id },
  });
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
