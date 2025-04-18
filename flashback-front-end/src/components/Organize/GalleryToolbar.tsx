import { useQueryClient } from "@tanstack/react-query";
import { CreateButton } from "./CreateButton";
import { DeleteImagesButton } from "./DeleteImagesButton";
import { StyledButtons } from "./OrganizeToolbar";
import { useOrganizeContext } from "../../contexts/OrganizeContext";
import { useDeleteImages, useUpdateImages } from "../../services";
import { Button } from "@mui/material";
import { API_PREFIX, Gallery, IMAGES_BY_GALLERY } from "../../apiConstants";
import { MoveImagesButton } from "./MoveImagesButton";
import { invalidateMapData } from "../../utils/invalidateMapData";

export const GalleryToolbar = ({
  currentGallery,
}: {
  currentGallery: Gallery;
}) => {
  const queryClient = useQueryClient();
  const { selectedImageIds, imageIds, multiSelectImages, resetSelections } =
    useOrganizeContext();

  const { mutate: mutateDeleteImages } = useDeleteImages();
  const { mutate: mutateUpdateImages } = useUpdateImages();

  const numberOfImages = imageIds.length;

  const handleDeleteImages = (closeDialog: () => void) => {
    mutateDeleteImages(
      { ids: [...selectedImageIds] },
      {
        onSuccess: () => handleDeleteImagesSuccess(),
        onSettled: closeDialog,
      }
    );
  };

  const handleDeleteImagesSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [`/${API_PREFIX}/${IMAGES_BY_GALLERY}/`, currentGallery.id],
    });
    invalidateMapData();
    resetSelections();
  };

  const handleMoveImages = ({
    closeDialog,
    selectedImageIds,
    newImagesParent,
  }: {
    closeDialog: () => void;
    selectedImageIds: number[];
    newImagesParent: Gallery;
  }) => {
    if (selectedImageIds.length === 0) {
      closeDialog();
      return;
    }

    mutateUpdateImages(
      {
        ids: selectedImageIds,
        parentId: newImagesParent.id,
      },
      {
        onSettled: closeDialog,
        onSuccess: () => handleMoveImagesSuccess(newImagesParent),
      }
    );
  };

  const handleMoveImagesSuccess = (newImagesParent: Gallery) => {
    queryClient.invalidateQueries({
      queryKey: [`/${API_PREFIX}/${IMAGES_BY_GALLERY}/`, currentGallery.id],
    });
    queryClient.invalidateQueries({
      queryKey: [`/${API_PREFIX}/${IMAGES_BY_GALLERY}/`, newImagesParent.id],
    });
    invalidateMapData();
    resetSelections();
  };

  return (
    <>
      <StyledButtons>
        <CreateButton currentFolder={null} />
        <DeleteImagesButton
          selectedImageIds={[...selectedImageIds]}
          handleDeleteImages={handleDeleteImages}
        />
        <MoveImagesButton
          selectedImageIds={[...selectedImageIds]}
          handleMoveImages={handleMoveImages}
        />
        <Button onClick={() => multiSelectImages(imageIds)}>Select All</Button>
        <Button onClick={resetSelections}>Deselect All</Button>
      </StyledButtons>
      <div>
        {selectedImageIds.size} of {numberOfImages} selected
      </div>
    </>
  );
};
