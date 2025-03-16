import { Typography } from "@mui/material";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { isFolder, isGallery } from "../../apiConstants";
import { FolderContentContainer } from "./FolderContentContainer";
import { GalleryContentContainer } from "./GalleryContentContainer";

export const ContentContainer = () => {
  const { currentNode: currentPosition } = useOrganizeContext();

  if (!currentPosition) return <Typography>No folder selected</Typography>;

  if (isFolder(currentPosition))
    return <FolderContentContainer folder={currentPosition} />;
  if (isGallery(currentPosition))
    return <GalleryContentContainer gallery={currentPosition} />;
};
