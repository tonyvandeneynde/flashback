import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { isFolder, isGallery } from "../../apiConstants";
import { FolderContentContainer } from "./FolderContentContainer";
import { GalleryContentContainer } from "./GalleryContentContainer";

export const ContentContainer = () => {
  const { currentNode } = useOrganizeContext();

  if (!currentNode) return null;

  if (isFolder(currentNode))
    return <FolderContentContainer folder={currentNode} />;
  if (isGallery(currentNode))
    return <GalleryContentContainer gallery={currentNode} />;
};
