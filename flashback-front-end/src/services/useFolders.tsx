import { useQuery } from "@tanstack/react-query";
import { API_PREFIX, Folder, FOLDERS } from "../apiConstants";
import axios from "axios";

export type NodeType = "folder" | "gallery";

const fetchFolders = async (): Promise<Folder[]> => {
  const response = await axios.get(`/${API_PREFIX}/${FOLDERS}`);
  return response.data;
};

export const useFolders = () => {
  const queryResult = useQuery({
    queryKey: [`/${API_PREFIX}/${FOLDERS}`],
    queryFn: fetchFolders,
  });

  return queryResult;
};
