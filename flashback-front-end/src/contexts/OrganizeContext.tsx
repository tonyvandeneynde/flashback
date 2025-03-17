import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useFolders } from "../services";
import { Gallery, Folder, Image } from "../apiConstants";

interface OrganizeContextType {
  folders: Folder[];
  currentNode: Folder | Gallery | null;
  selectedNode: Folder | Gallery | null;
  selectedImages: Image[];
  path: (Folder | Gallery)[];
  isFoldersLoading: boolean;
  setCurrentNode: (node: Folder | Gallery) => void;
  toggleSelectedImage: (image: Image) => void;
  toggleSelectedNode: (item: Folder | Gallery) => void;
  setPath: (newPath: (Folder | Gallery)[]) => void;
  resetSelectedNodes: () => void;
  resetSelectedImages: () => void;
}

const initialOrganizeContext: OrganizeContextType = {
  folders: [],
  isFoldersLoading: false,
  currentNode: null,
  selectedNode: null,
  selectedImages: [],
  path: [],
  setCurrentNode: () => {},
  toggleSelectedNode: () => {},
  toggleSelectedImage: () => {},
  setPath: () => {},
  resetSelectedNodes: () => {},
  resetSelectedImages: () => {},
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
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
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

  const toggleSelectedImage = (image: Image) => {
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(image)) {
        return prevSelectedImages.filter(
          (selectedImage) => selectedImage !== image
        );
      } else {
        return [...prevSelectedImages, image];
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
    setSelectedImages([]);
  };

  useEffect(() => {
    // Deselect everything when the current node changes
    setSelectedImages([]);
    setSelectedNode(null);
  }, [currentNode]);

  useEffect(() => {
    // Set the first (Home folder)  as the current node as the default after fetching folders
    if (currentNode === null && folders.length > 0) {
      handleSetPath([folders[0]]);
    }
  }, [folders]);

  return (
    <OrganizeContext.Provider
      value={{
        folders,
        isFoldersLoading,
        currentNode,
        selectedNode,
        selectedImages,
        path,
        setCurrentNode,
        toggleSelectedNode,
        toggleSelectedImage,
        setPath: handleSetPath,
        resetSelectedNodes,
        resetSelectedImages,
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
