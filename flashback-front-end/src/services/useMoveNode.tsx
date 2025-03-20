import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  API_PREFIX,
  Folder,
  FOLDERS,
  FOLDERS_UPDATE,
  FOLDERS_UPDATE_GALLERY,
  Gallery,
} from "../apiConstants";
import axios from "axios";

const updateNode = async ({
  id,
  name,
  parentId,
  type,
}: {
  id: number;
  parentId?: number;
  name?: string;
  type: "Folder" | "Gallery";
}): Promise<Folder | Gallery> => {
  let url = `${API_PREFIX}/`;
  if (type === "Folder") {
    url += FOLDERS_UPDATE;
  } else {
    url += FOLDERS_UPDATE_GALLERY;
  }

  const response = await axios.put(url, {
    id,
    name,
    parentId,
  });
  return response.data;
};

export const useUpdateNode = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateNode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${API_PREFIX}/${FOLDERS}`] });
    },
  });

  return mutation;
};
