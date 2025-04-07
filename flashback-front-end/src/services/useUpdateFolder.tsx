import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_PREFIX, Folder, FOLDERS, FOLDERS_UPDATE } from "../apiConstants";
import axios from "axios";

const updateFolder = async ({
  id,
  name,
  parentId,
}: {
  id: number;
  parentId?: number;
  name?: string;
}): Promise<Folder> => {
  let url = `${API_PREFIX}/${FOLDERS_UPDATE}`;

  const response = await axios.put(url, {
    id,
    name,
    parentId,
  });
  return response.data;
};

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${API_PREFIX}/${FOLDERS}`] });
    },
  });

  return mutation;
};
