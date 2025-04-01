import { useQuery } from "@tanstack/react-query";
import { API_PREFIX, GALLERY_MAP_DATA, MapData } from "../apiConstants";
import axios from "axios";

interface MapDataProps {
  type: "folder" | "gallery";
  parentId: number;
}

const fetchMapData = async (url: string): Promise<MapData[]> => {
  const response = await axios.get(`${url}`);
  return response.data;
};

export const useMapData = ({ type, parentId }: MapDataProps) => {
  let url = `${API_PREFIX}/${GALLERY_MAP_DATA}/${parentId}`;

  const queryResult = useQuery({
    queryKey: [url],
    queryFn: () => fetchMapData(url),
  });

  return queryResult;
};
