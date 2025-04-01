import { CircularProgress } from "@mui/material";
import { useMapData } from "../../services";
import { ImageMap } from "../Site";

interface GalleryMapProps {
  galleryId: number;
}

export const GalleryMap = ({ galleryId }: GalleryMapProps) => {
  const { data, isLoading } = useMapData({
    parentId: galleryId,
    type: "gallery",
  });

  if (isLoading || !data) {
    return <CircularProgress />;
  }

  return <ImageMap imagePositions={data || []} />;
};
