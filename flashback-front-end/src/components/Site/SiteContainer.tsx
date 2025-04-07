import { styled, Typography } from "@mui/material";
import { useFolders } from "../../services";
import { useEffect, useState } from "react";
import { Folder, Gallery, isFolder } from "../../apiConstants";
import { NodeTile } from "./NodeTile";
import { BreadcrumbBar } from "../BreadcrumbBar/BreadcrumbBar";
import { GalleryMap } from "../Map";
import { ImageGalleryContainer } from "../ImageGallery/ImageGalleryContainer";

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

export const SiteContainer = () => {
  const { data, isLoading } = useFolders();
  const [path, setPath] = useState<(Folder | Gallery)[]>([]);
  const [currentNode, setCurrentNode] = useState<Folder | Gallery | undefined>(
    undefined
  );

  const handleNodeChanged = (node: Folder | Gallery) => {
    if (path.length === 0) {
      setPath([...path, node]);
    } else {
      const nodeAdded = path.indexOf(node) === -1;
      if (nodeAdded) {
        setPath([...path, node]);
      } else {
        setPath([...path.slice(0, path.indexOf(node) + 1)]);
      }
    }
    setCurrentNode(node);
  };

  useEffect(() => {
    if (!currentNode && data?.[0]) handleNodeChanged(data?.[0]);
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentNode) {
    return <div>No folders or galleries found. Create some in Organize</div>;
  }

  return (
    <Container>
      <BreadcrumbBar path={path} onClick={handleNodeChanged} />
      {isFolder(currentNode) ? (
        <>
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
