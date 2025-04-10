import { CircularProgress, styled } from "@mui/material";
import { useFolders, useMapData } from "../../services";
import { ImageMap } from "../Site";

interface FolderMapProps {
  folderId: number;
}

const StyledCircularProgress = styled(CircularProgress)`
  margin: auto;
`;

export const FolderMap = ({ folderId }: FolderMapProps) => {
  const { data: folders, isLoading: isFoldersLoading } = useFolders();
  const { data, isLoading } = useMapData({
    nodeId: folderId,
    type: "folder",
  });

  if (isLoading || !data || isFoldersLoading || !folders) {
    return <StyledCircularProgress />;
  }

  return (
    <ImageMap
      imagePositions={data || []}
      mapStyles={{ width: "100%", height: "600px" }}
      folders={folders}
    />
  );
};
