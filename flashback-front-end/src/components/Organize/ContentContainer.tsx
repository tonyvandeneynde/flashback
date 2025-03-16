import { Typography } from "@mui/material";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { isFolder, isGallery } from "../../apiConstants";
import { FolderContentContainer } from "./FolderContentContainer";
import { GalleryContentContainer } from "./GalleryContentContainer";

export const ContentContainer = () => {
  const { currentNode } = useOrganizeContext();

  if (!currentNode) return <Typography>No folder selected</Typography>;

  if (isFolder(currentNode))
    return <FolderContentContainer folder={currentNode} />;
  if (isGallery(currentNode))
    return <GalleryContentContainer gallery={currentNode} />;
};
