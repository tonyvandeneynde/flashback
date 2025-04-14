import { useQuery } from "@tanstack/react-query";
import {
  API_PREFIX,
  FOLDER_MAP_DATA,
  GALLERY_MAP_DATA,
  MapData,
} from "../apiConstants";
import axios from "axios";
import { NodeType } from "./useFolders";

interface MapDataProps {
  type: NodeType;
  nodeId: number;
}

const fetchFolderMapData = async (url: string): Promise<MapData[]> => {
  const response = await axios.get(`${url}`);
  return response.data;
};

export const useMapData = ({ type, nodeId }: MapDataProps) => {
  const mapDataType = type === "folder" ? FOLDER_MAP_DATA : GALLERY_MAP_DATA;
  let url = `/${API_PREFIX}/${mapDataType}/${nodeId}`;

  const queryResult = useQuery({
    queryKey: [`/${API_PREFIX}/${mapDataType}/`, nodeId],
    queryFn: () => fetchFolderMapData(url),
  });

  return queryResult;
};
