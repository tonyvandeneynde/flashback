import { Toolbar } from "@mui/material";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { Folder, Gallery, isFolder, isGallery } from "../../apiConstants";
import { useCreateFolder } from "../../services/useCreateFolder";
import { useCreateGallery } from "../../services/useCreateNewGallery";
import { CreateButton } from "./CreateButton";
import { DeleteButton } from "./DeleteButton";
import { useDeleteNode } from "../../services";

export const OrganizeToolbar = () => {
  const { currentNode, selectedNodes, resetSelectedNodes } =
    useOrganizeContext();
  const { mutate } = useCreateFolder();
  const { mutate: mutateCreateGallery } = useCreateGallery();
  const { mutate: mutateDeleteFolder } = useDeleteNode();

  const handleCreateSuccess = (
    newFolderOrGallery: Folder | Gallery,
    closeDialog: () => void
  ) => {
    closeDialog();

    if (currentNode === null || !isFolder(currentNode)) return;

    if (isFolder(newFolderOrGallery)) {
      currentNode.subfolders.push(newFolderOrGallery);
    }

    if (isGallery(newFolderOrGallery)) {
      currentNode.galleries.push(newFolderOrGallery);
    }
  };

  const handleCreate = (
    dialogType: "Folder" | "Gallery" | null,
    name: string,
    closeDialog: () => void
  ) => {
    if (currentNode === null) return;

    if (dialogType === "Folder") {
      mutate(
        { name, parentId: currentNode?.id },
        {
          onSuccess: (newFolder) => handleCreateSuccess(newFolder, closeDialog),
        }
      );
    }

    if (dialogType === "Gallery") {
      mutateCreateGallery(
        { name, parentId: currentNode?.id },
        {
          onSuccess: (newGallery) =>
            handleCreateSuccess(newGallery, closeDialog),
        }
      );
    }
  };

  const handleDelete = (closeDialog: () => void) => {
    if (selectedNodes.length !== 1) return;

    mutateDeleteFolder(
      {
        id: selectedNodes[0].id,
        type: isFolder(selectedNodes[0]) ? "Folder" : "Gallery",
      },
      {
        onSuccess: () => handleDeleteSuccess(selectedNodes[0], closeDialog),
      }
    );
  };

  const handleDeleteSuccess = (
    nodeToDelete: Folder | Gallery,
    closeDialog: () => void
  ) => {
    closeDialog();

    if (currentNode === null || (currentNode && !isFolder(currentNode))) return;

    if (isFolder(nodeToDelete)) {
      currentNode.subfolders = currentNode.subfolders.filter(
        (folder) => folder.id !== nodeToDelete.id
      );
    }

    if (isGallery(nodeToDelete)) {
      currentNode.galleries = currentNode.galleries.filter(
        (gallery) => gallery.id !== nodeToDelete.id
      );
    }

    resetSelectedNodes();
  };

  return (
    <Toolbar>
      <CreateButton currentNode={currentNode} handleCreate={handleCreate} />
      <DeleteButton selectedNodes={selectedNodes} handleDelete={handleDelete} />
    </Toolbar>
  );
};
