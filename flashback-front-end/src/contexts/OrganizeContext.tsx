import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useFolders } from "../services";
import { Gallery, Folder, isFolder } from "../apiConstants";
import { getTreeNodeById } from "../utils";

interface OrganizeContextType {
  folders: Folder[];
  currentNode: Folder | Gallery | null;
  selectedNode: Folder | Gallery | null;
  selectedImageIds: number[];
  path: (Folder | Gallery)[];
  isFoldersLoading: boolean;
  setCurrentNode: (node: Folder | Gallery) => void;
  toggleSelectedImage: (imagId: number) => void;
  toggleSelectedNode: (item: Folder | Gallery) => void;
  multiSelectImages: (imageIds: number[]) => void;
  setPath: (newPath: (Folder | Gallery)[]) => void;
  resetSelections: () => void;
}

const initialOrganizeContext: OrganizeContextType = {
  folders: [],
  isFoldersLoading: false,
  currentNode: null,
  selectedNode: null,
  selectedImageIds: [],
  path: [],
  setCurrentNode: () => {},
  toggleSelectedNode: () => {},
  toggleSelectedImage: () => {},
  multiSelectImages: () => {},
  setPath: () => {},
  resetSelections: () => {},
};

const OrganizeContext = createContext<OrganizeContextType>(
  initialOrganizeContext
);

export const OrganizeContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentNode, setCurrentNode] = useState<Folder | Gallery | null>(null);
  const [selectedNode, setSelectedNode] = useState<Folder | Gallery | null>(
    null
  );
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
  const [path, setPath] = useState<(Folder | Gallery)[]>([]);

  const { data: fetchedFoldersData, isLoading: isFoldersLoading } =
    useFolders();

  useEffect(() => {
    if (!isFoldersLoading && fetchedFoldersData) {
      setFolders(fetchedFoldersData);
    }
  }, [fetchedFoldersData, isFoldersLoading]);

  const toggleSelectedNode = (node: Folder | Gallery | null) => {
    setSelectedNode((prevSelectedNode) => {
      if (prevSelectedNode === node) {
        return null;
      } else {
        return node;
      }
    });
  };

  const toggleSelectedImage = (imageId: number) => {
    setSelectedImageIds((prevSelectedImageIds) => {
      if (prevSelectedImageIds.includes(imageId)) {
        return prevSelectedImageIds.filter(
          (selectedImageId) => selectedImageId !== imageId
        );
      } else {
        return [...prevSelectedImageIds, imageId];
      }
    });
  };

  const handleSetPath = (newPath: (Folder | Gallery)[]) => {
    setPath(newPath);
    setCurrentNode(newPath[newPath.length - 1]);
  };

  const resetSelectedNodes = () => {
    setSelectedNode(null);
  };

  const resetSelectedImages = () => {
    setSelectedImageIds([]);
  };

  const resetSelections = () => {
    resetSelectedNodes();
    resetSelectedImages();
  };

  const multiSelectImages = (imageIds: number[]) => {
    setSelectedImageIds((prevSelectedImageIds) => [
      ...prevSelectedImageIds,
      ...imageIds,
    ]);
  };

  useEffect(() => {
    // Deselect everything when the current node changes
    setSelectedImageIds([]);
    setSelectedNode(null);
  }, [currentNode]);

  useEffect(() => {
    // Set the first (Home folder)  as the current node as the default after fetching folders
    if (currentNode === null && folders.length > 0) {
      handleSetPath([folders[0]]);
    } else if (currentNode !== null) {
      // reset the currentNode from the updated folders
      const updatedNode = getTreeNodeById(
        folders,
        currentNode.id,
        isFolder(currentNode) ? "Folder" : "Gallery"
      );
      if (updatedNode) {
        setCurrentNode(updatedNode);
      } else {
        // Fallback to home folder if the current node is not found in the updated folders
        setCurrentNode(folders[0]);
      }
    }
  }, [folders]);

  return (
    <OrganizeContext.Provider
      value={{
        folders,
        isFoldersLoading,
        currentNode,
        selectedNode,
        selectedImageIds,
        path,
        setCurrentNode,
        toggleSelectedNode,
        toggleSelectedImage,
        multiSelectImages,
        setPath: handleSetPath,
        resetSelections,
      }}
    >
      {children}
    </OrganizeContext.Provider>
  );
};

export const useOrganizeContext = () => {
  const context = useContext(OrganizeContext);
  if (context === undefined) {
    throw new Error("useFolderContext must be used within a FolderProvider");
  }
  return context;
};
