import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_PREFIX, FOLDERS, GALLERY, Gallery } from "../apiConstants";
import axios from "axios";
import { invalidateMapData } from "../utils/invalidateMapData";

const updateGallery = async ({
  id,
  name,
  parentId,
  coverImageId,
  showMapInGallery,
  showImagesOnParentFolderMaps,
}: {
  id: number;
  parentId?: number;
  name?: string;
  coverImageId?: number;
  showMapInGallery?: boolean;
  showImagesOnParentFolderMaps?: boolean;
}): Promise<Gallery> => {
  const url = `/${API_PREFIX}/${GALLERY}`;

  const response = await axios.put(url, {
    id,
    name,
    parentId,
    coverImageId,
    showMapInGallery,
    showImagesOnParentFolderMaps,
  });
  return response.data;
};

export const useUpdateGallery = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/${API_PREFIX}/${FOLDERS}`],
      });
      invalidateMapData();
    },
  });

  return mutation;
};
