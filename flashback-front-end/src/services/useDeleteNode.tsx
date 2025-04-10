import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  API_PREFIX,
  Folder,
  FOLDERS,
  FOLDERS_DELETE,
  FOLDERS_DELETE_GALLERY,
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
    },
  });

  return mutation;
};
