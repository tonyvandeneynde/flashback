import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  API_PREFIX,
  Folder,
  FOLDERS,
  FOLDERS_GALLERIES,
} from "../apiConstants";
import axios from "axios";

const createGallery = async ({
  name,
  parentId,
}: {
  name: string;
  parentId: number;
}): Promise<Folder> => {
  const response = await axios.post(`/${API_PREFIX}/${FOLDERS_GALLERIES}`, {
    name,
    parentId,
  });
  return response.data;
};

export const useCreateGallery = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/${API_PREFIX}/${FOLDERS}`],
      });
    },
  });

  return mutation;
};
