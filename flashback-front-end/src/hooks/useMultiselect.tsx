// import { useState } from "react";

// export const useMultiSelect = <T extends { id: number }>(
//   initialSelection: T[] = []
// ) => {
//   const [selectedItems, setSelectedItems] = useState<T[]>(initialSelection);

//   const selectItem = (item: T) => {
//     setSelectedItems((prevSelectedItems) => {
//       if (
//         prevSelectedItems.some((selectedItem) => selectedItem.id === item.id)
//       ) {
//         return prevSelectedItems.filter(
//           (selectedItem) => selectedItem.id !== item.id
//         );
//       }

//       return [...prevSelectedItems, item];
//     });
//   };

//   const selectAll = (items: T[]) => {
//     setSelectedItems(items);
//   };

//   const deselectAll = () => {
//     setSelectedItems([]);
//   };

//   return {
//     selectedItems,
//     selectItem,
//     selectAll,
//     deselectAll,
//   };
// };

import { useState, useEffect } from "react";
import { Image } from "../apiConstants";

export const useMultiselect = ({
  images,
  selectedImageIds,
  multiSelectImages,
}: {
  images: Image[];
  selectedImageIds: number[];
  multiSelectImages: (ids: number[]) => void;
}) => {
  const [isMultiselectActive, setIsMultiselectActive] = useState(false);
  const [
    firstSelectedImageIndexInGallery,
    setFirstSelectedImageIndexInGallery,
  ] = useState<number | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Shift") {
      setIsMultiselectActive(true);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === "Shift") {
      setIsMultiselectActive(false);
    }
  };

  const handleImageClick = (imageId: number) => {
    if (isMultiselectActive) {
      const firstImageIndex = firstSelectedImageIndexInGallery || 0;

      const imageIndex = images.findIndex((img) => img.id === imageId);
      if (imageIndex === -1) return;

      const start = Math.min(firstImageIndex, imageIndex);
      const end = Math.max(firstImageIndex, imageIndex);

      const selectedImagesInBetween = images.slice(start, end + 1);
      const newSelectedImageIds = selectedImagesInBetween.map((img) => img.id);

      multiSelectImages(newSelectedImageIds);
    }
  };

  useEffect(() => {
    const firstSelectedImageInGalleryIndex = selectedImageIds.reduce(
      (acc, imageId) => {
        const imageIndex = images.findIndex((img) => img.id === imageId);
        if (imageIndex !== -1) {
          if (acc === null) {
            return imageIndex;
          } else {
            return Math.min(acc, imageIndex);
          }
        } else {
          return acc;
        }
      },
      null as number | null
    );

    setFirstSelectedImageIndexInGallery(firstSelectedImageInGalleryIndex);
  }, [selectedImageIds, images]);

  return {
    isMultiselectActive,
    handleKeyDown,
    handleKeyUp,
    handleImageClick,
  };
};
