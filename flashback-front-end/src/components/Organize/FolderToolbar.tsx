import { CreateButton } from "./CreateButton";
import { DeleteNodeButton } from "./DeleteNodeButton";
import { StyledButtons } from "./OrganizeToolbar";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { Folder, Gallery, isFolder, isGallery } from "../../apiConstants";
import {
  NodeType,
  useCreateFolder,
  useCreateGallery,
  useDeleteNode,
  useUpdateFolder,
  useUpdateGallery,
} from "../../services";
import { MoveNodeButton } from "./MoveNodeButton";
import { GallerySettingsButton } from "./GallerySettingsButton";
import { Image } from "../../apiConstants";
import { FolderSettingsButton } from "./FolderSettingsButton";

export const FolderToolbar = ({ currentFolder }: { currentFolder: Folder }) => {
  const { currentNode, selectedNode, resetSelections } = useOrganizeContext();

  const { mutate: mutateCreateFolder } = useCreateFolder();
  const { mutate: mutateCreateGallery } = useCreateGallery();
  const { mutate: mutateDeleteNode } = useDeleteNode();
  const { mutate: mutateUpdateFolder } = useUpdateFolder();
  const { mutate: mutateUpdateGallery } = useUpdateGallery();

  const handleCreateNode = async (
    type: NodeType,
    name: string,
    closeDialog: () => void
  ) => {
    if (currentNode === null) return;

    const createMutation =
      type === "folder" ? mutateCreateFolder : mutateCreateGallery;

    createMutation(
      { name, parentId: currentNode?.id },
      { onSettled: closeDialog }
    );
  };

  const handleDeleteNode = (closeDialog: () => void) => {
    if (!selectedNode) {
      closeDialog();
      return;
    }

    mutateDeleteNode(
      {
        id: selectedNode.id,
        type: isFolder(selectedNode) ? "folder" : "gallery",
      },
      {
        onSettled: () => {
          closeDialog();
          resetSelections;
        },
      }
    );
  };

  const handleMoveNode = ({
    closeDialog,
    selectedNode,
    newParentFolder,
  }: {
    closeDialog: () => void;
    selectedNode: Folder | Gallery;
    newParentFolder: Folder;
  }) => {
    const updateMutation = isFolder(selectedNode)
      ? mutateUpdateFolder
      : mutateUpdateGallery;

    updateMutation(
      {
        id: selectedNode.id,
        parentId: newParentFolder.id,
      },
      {
        onSettled: closeDialog,
        onSuccess: resetSelections,
      }
    );
  };

  const handleGallerySettings = ({
    name,
    showMapInGallery,
    showImagesOnParentFolderMaps,
    newCoverImage,
    closeDialog,
  }: {
    name: string | null;
    showMapInGallery: boolean | null;
    showImagesOnParentFolderMaps: boolean | null;
    newCoverImage: Image | null;
    closeDialog: () => void;
  }) => {
    if (!selectedNode || !isGallery(selectedNode)) {
      closeDialog();
      return;
    }

    mutateUpdateGallery(
      {
        id: selectedNode.id,
        name: name ?? selectedNode.name,
        showMapInGallery: showMapInGallery ?? selectedNode.showMapInGallery,
        showImagesOnParentFolderMaps:
          showImagesOnParentFolderMaps ??
          selectedNode.showImagesOnParentFolderMaps,
        coverImageId: newCoverImage?.id,
      },
      { onSettled: closeDialog }
    );
  };

  const handleFolderSettings = ({
    name,
    showMapInFolder,
    closeDialog,
  }: {
    name: string | null;
    showMapInFolder: boolean | null;
    closeDialog: () => void;
  }) => {
    if (!selectedNode || !isFolder(selectedNode)) {
      closeDialog();
      return;
    }

    mutateUpdateFolder(
      {
        id: selectedNode.id,
        name: name ?? selectedNode.name,
        showMapInFolder: showMapInFolder ?? selectedNode.showMapInFolder,
      },
      { onSettled: closeDialog }
    );
  };

  return (
    <StyledButtons>
      <CreateButton
        currentFolder={currentFolder}
        handleCreate={handleCreateNode}
      />
      <DeleteNodeButton
        selectedNode={selectedNode}
        handleDeleteNode={handleDeleteNode}
      />
      <MoveNodeButton
        selectedNode={selectedNode}
        handleMoveNode={handleMoveNode}
      />
      {selectedNode && isGallery(selectedNode) && (
        <GallerySettingsButton
          selectedGallery={selectedNode}
          onGallerySettingsChange={handleGallerySettings}
        />
      )}
      {selectedNode && isFolder(selectedNode) && (
        <FolderSettingsButton
          selectedFolder={selectedNode}
          onFolderSettingsChange={handleFolderSettings}
        />
      )}
    </StyledButtons>
  );
};
