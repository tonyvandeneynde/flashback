import { useMutation } from "@tanstack/react-query";
import { API_PREFIX, Folder, Gallery, IMAGES_UPDATE } from "../apiConstants";
import axios from "axios";

const updateImages = async ({
  ids,
  parentId,
}: {
  ids: number[];
  parentId: number;
}): Promise<Folder | Gallery> => {
  let url = `${API_PREFIX}/${IMAGES_UPDATE}`;

  const response = await axios.put(url, {
    ids,
    parentId,
  });
  return response.data;
};

export const useUpdateImages = () => {
  const mutation = useMutation({
    mutationFn: updateImages,
  });

  return mutation;
};
