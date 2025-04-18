import {
  API_PREFIX,
  FOLDERS_MAP_DATA,
  GALLERY_MAP_DATA,
} from "../apiConstants";
import { queryClient } from "../services";

export const invalidateMapData = () => {
  queryClient.invalidateQueries({
    queryKey: [`/${API_PREFIX}/${GALLERY_MAP_DATA}/`],
    exact: false,
  });
  queryClient.invalidateQueries({
    queryKey: [`/${API_PREFIX}/${FOLDERS_MAP_DATA}/`],
    exact: false,
  });
};
