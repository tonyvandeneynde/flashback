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
    parentId: galleryId,
    type: "gallery",
  });

  if (isLoading || !data) {
    return <StyledCircularProgress />;
  }

  return <ImageMap imagePositions={data || []} />;
};
