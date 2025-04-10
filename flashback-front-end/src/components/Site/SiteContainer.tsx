import { styled, Typography } from "@mui/material";
import { useFolders } from "../../services";
import { useEffect, useState } from "react";
import { Folder, Gallery, isFolder } from "../../apiConstants";
import { NodeTile } from "./NodeTile";
import { BreadcrumbBar } from "../BreadcrumbBar/BreadcrumbBar";
import { GalleryMap } from "../Map";
import { ImageGalleryContainer } from "../ImageGallery/ImageGalleryContainer";
import { FolderMap } from "../Map/FolderMap";
import { getTreeNodesFromUrlPath, getUrlPathForNode } from "../../utils";
import { useNavigate } from "react-router-dom";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
`;

const GridContainer = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
`;

export const SiteContainer = ({ path }: { path: string[] }) => {
  const nav = useNavigate();
  const { data: folders, isLoading } = useFolders();
  const [folderPath, setFolderPath] = useState<(Folder | Gallery)[]>([]);
  const [currentNode, setCurrentNode] = useState<Folder | Gallery | undefined>(
    undefined
  );

  useEffect(() => {
    if (!folders) return;

    const treeNodePath = getTreeNodesFromUrlPath(folders, path);
    if (treeNodePath === null) {
      nav("/site/home");
    } else {
      setFolderPath(treeNodePath);
      setCurrentNode(treeNodePath[treeNodePath.length - 1]);
    }
  }, [folders, path]);

  const handleNodeChanged = (node: Folder | Gallery) => {
    if (!folders) return;

    const urlPath = getUrlPathForNode(folders, node);

    nav(`/site/home/${urlPath}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentNode) {
    return <div>No folders or galleries found. Create some in Organize</div>;
  }

  return (
    <Container>
      <BreadcrumbBar path={folderPath} onClick={handleNodeChanged} />
      {isFolder(currentNode) ? (
        <>
          {currentNode.showMapInFolder && (
            <FolderMap folderId={currentNode.id} />
          )}
          {currentNode.galleries.length === 0 &&
            currentNode.subfolders.length === 0 && (
              <Typography textAlign={"center"}>
                Add a folder or gallery in Organize
              </Typography>
            )}
          <GridContainer>
            {[...currentNode.subfolders, ...currentNode.galleries].map(
              (folder) => (
                <NodeTile
                  key={folder.id}
                  node={folder}
                  onClick={() => handleNodeChanged(folder)}
                />
              )
            )}
          </GridContainer>
        </>
      ) : (
        <>
          {currentNode.showMapInGallery && (
            <GalleryMap galleryId={currentNode.id} />
          )}
          <ImageGalleryContainer galleryId={currentNode.id} />
        </>
      )}
    </Container>
  );
};
