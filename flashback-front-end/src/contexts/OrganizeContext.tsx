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
  selectedNodes: (Folder | Gallery)[];
  selectedImages: Image[];
  path: (Folder | Gallery)[];
  isFoldersLoading: boolean;
  setCurrentNode: (node: Folder | Gallery) => void;
  toggleSelectedImage: (image: Image) => void;
  toggleSelectedNode: (item: Folder | Gallery) => void;
  setPath: (newPath: (Folder | Gallery)[]) => void;
}

const initialOrganizeContext: OrganizeContextType = {
  folders: [],
  isFoldersLoading: false,
  currentNode: null,
  selectedNodes: [],
  selectedImages: [],
  path: [],
  setCurrentNode: () => {},
  toggleSelectedNode: () => {},
  toggleSelectedImage: () => {},
  setPath: () => {},
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
  const [selectedNodes, setSelectedNodes] = useState<(Folder | Gallery)[]>([]);
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [path, setPath] = useState<(Folder | Gallery)[]>([]);

  const { data: fetchedFoldersData, isLoading: isFoldersLoading } =
    useFolders();

  useEffect(() => {
    if (!isFoldersLoading && fetchedFoldersData) {
      setFolders(fetchedFoldersData);
    }
  }, [fetchedFoldersData, isFoldersLoading]);

  const toggleSelectedNode = (node: Folder | Gallery) => {
    setSelectedNodes((prevSelectedNodes) => {
      if (prevSelectedNodes.includes(node)) {
        return prevSelectedNodes.filter(
          (selectedNode) => selectedNode !== node
        );
      } else {
        return [...prevSelectedNodes, node];
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

  useEffect(() => {
    setSelectedImages([]);
    setSelectedNodes([]);
  }, [currentNode]);

  return (
    <OrganizeContext.Provider
      value={{
        folders,
        isFoldersLoading,
        currentNode,
        selectedNodes: selectedNodes,
        selectedImages: selectedImages,
        path,
        setCurrentNode,
        toggleSelectedNode,
        toggleSelectedImage,
        setPath,
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
