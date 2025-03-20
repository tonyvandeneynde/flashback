import { Toolbar } from "@mui/material";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import {
  API_PREFIX,
  Folder,
  Gallery,
  IMAGES_BY_GALLERY,
  isFolder,
  Image,
} from "../../apiConstants";
import { useCreateFolder } from "../../services/useCreateFolder";
import { useCreateGallery } from "../../services/useCreateNewGallery";
import { CreateButton } from "./CreateButton";
import { DeleteButton } from "./DeleteButton";
import { useDeleteNode, useUpdateImages } from "../../services";
import { useDeleteImages } from "../../services/useDeleteImages";
import { useQueryClient } from "@tanstack/react-query";
import { MoveButton } from "./MoveButton";
import { useUpdateNode } from "../../services/useMoveNode";

export const OrganizeToolbar = () => {
  const queryClient = useQueryClient();
  const { currentNode, selectedNode, selectedImages, resetSelections } =
    useOrganizeContext();
  const { mutate } = useCreateFolder();
  const { mutate: mutateCreateGallery } = useCreateGallery();
  const { mutate: mutateDeleteFolder } = useDeleteNode();
  const { mutate: mutateDeleteImages } = useDeleteImages();
  const { mutate: mutateMoveNode } = useUpdateNode();
  const { mutate: mutateUpdateImages } = useUpdateImages();

  const handleCreate = (
    dialogType: "Folder" | "Gallery" | null,
    name: string,
    closeDialog: () => void
  ) => {
    if (currentNode === null) return;

    if (dialogType === "Folder") {
      mutate({ name, parentId: currentNode?.id });
    }

    if (dialogType === "Gallery") {
      mutateCreateGallery({ name, parentId: currentNode?.id });
    }
    closeDialog();
  };

  const handleDeleteNodes = (closeDialog: () => void) => {
    if (!selectedNode) return;

    mutateDeleteFolder(
      {
        id: selectedNode.id,
        type: isFolder(selectedNode) ? "Folder" : "Gallery",
      },
      {
        onSuccess: resetSelections,
      }
    );
    closeDialog();
  };

  const handleDeleteImages = (closeDialog: () => void) => {
    mutateDeleteImages(
      { ids: selectedImages.map((image) => image.id) },
      {
        onSuccess: () => handleDeleteImagesSuccess(),
      }
    );
    closeDialog();
  };

  const handleDeleteImagesSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [`${API_PREFIX}/${IMAGES_BY_GALLERY}/${currentNode?.id}`],
    });
    resetSelections();
  };

  const handleMoveNode = ({
    closeDialog,
    selectedNode,
    newNodeParent,
  }: {
    closeDialog: () => void;
    selectedNode: Folder | Gallery;
    newNodeParent: Folder;
  }) => {
    if (!selectedNode || !newNodeParent) return;
    mutateMoveNode(
      {
        id: selectedNode.id,
        parentId: newNodeParent.id,
        type: isFolder(selectedNode) ? "Folder" : "Gallery",
      },
      {
        onSuccess: resetSelections,
      }
    );
    closeDialog();
  };

  const handleMoveImages = ({
    closeDialog,
    selectedImages,
    newImagesParent,
  }: {
    closeDialog: () => void;
    selectedImages: Image[];
    newImagesParent: Gallery;
  }) => {
    if (selectedImages.length === 0 || !newImagesParent) return;
    mutateUpdateImages(
      {
        ids: selectedImages.map((image) => image.id),
        parentId: newImagesParent.id,
      },
      {
        onSuccess: () => handleMoveImagesSuccess(newImagesParent),
      }
    );
    closeDialog();
  };

  const handleMoveImagesSuccess = (newImagesParent: Gallery) => {
    queryClient.invalidateQueries({
      queryKey: [`${API_PREFIX}/${IMAGES_BY_GALLERY}/${currentNode?.id}`],
    });
    queryClient.invalidateQueries({
      queryKey: [`${API_PREFIX}/${IMAGES_BY_GALLERY}/${newImagesParent.id}`],
    });
    resetSelections();
  };

  return (
    <Toolbar>
      <CreateButton currentNode={currentNode} handleCreate={handleCreate} />
      <DeleteButton
        selectedNode={selectedNode}
        selectedImages={selectedImages}
        handleDeleteNodes={handleDeleteNodes}
        handleDeleteImages={handleDeleteImages}
      />
      <MoveButton
        selectedNode={selectedNode}
        handleMoveNode={handleMoveNode}
        selectedImages={selectedImages}
        handleMoveImages={handleMoveImages}
      />
    </Toolbar>
  );
};
