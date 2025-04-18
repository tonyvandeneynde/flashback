import { CircularProgress, styled } from "@mui/material";
import { useMapData } from "../../services";
import { ImageMap } from "../Site";

interface GalleryMapProps {
  galleryId: number;
}

const StyledCircularProgress = styled(CircularProgress)`
  margin: auto;
`;

export const GalleryMap = ({ galleryId }: GalleryMapProps) => {
  const { data, isLoading } = useMapData({
    nodeId: galleryId,
    type: "gallery",
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
