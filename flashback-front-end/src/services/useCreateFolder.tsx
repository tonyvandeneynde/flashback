import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_PREFIX, Folder, FOLDERS } from "../apiConstants";
import axios from "axios";

const createFolder = async ({
  name,
  parentId,
}: {
  name: string;
  parentId: number;
}): Promise<Folder> => {
  const response = await axios.post(`/${API_PREFIX}/${FOLDERS}`, {
    name,
    parentId,
  });
  return response.data;
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [`/${API_PREFIX}/${FOLDERS}`],
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/${API_PREFIX}/${FOLDERS}`],
      });
    },
  });

  return mutation;
};
