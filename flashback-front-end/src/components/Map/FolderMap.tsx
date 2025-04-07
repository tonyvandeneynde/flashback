import { CircularProgress, styled } from "@mui/material";
import { useMapData } from "../../services";
import { ImageMap } from "../Site";

interface FolderMapProps {
  folderId: number;
}

const StyledCircularProgress = styled(CircularProgress)`
  margin: auto;
`;

export const FolderMap = ({ folderId }: FolderMapProps) => {
  const { data, isLoading } = useMapData({
    nodeId: folderId,
    type: "folder",
  });

  if (isLoading || !data) {
    return <StyledCircularProgress />;
  }

  return (
    <ImageMap
      imagePositions={data || []}
      mapStyles={{ width: "100%", height: "600px" }}
    />
  );
};
