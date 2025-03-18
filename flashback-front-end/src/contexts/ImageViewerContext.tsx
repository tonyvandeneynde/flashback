import { createContext, useContext, useState, ReactNode } from "react";
import { Image } from "../apiConstants";

interface ImageViewerContextProps {
  initialImage: Image | null;
  isOpen: boolean;
  galleryId: number | null;
  openViewer: ({
    galleryId,
    initialImage,
  }: {
    galleryId: number;
    initialImage: Image;
  }) => void;
  closeViewer: () => void;
}

const initialContext: ImageViewerContextProps = {
  galleryId: null,
  initialImage: null,
  isOpen: false,
  openViewer: () => {},
  closeViewer: () => {},
};

const ImageViewerContext =
  createContext<ImageViewerContextProps>(initialContext);

export const ImageViewerProvider = ({ children }: { children: ReactNode }) => {
  const [galleryId, setGalleryId] = useState<number | null>(null);
  const [initialImage, setInitialImage] = useState<Image | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openViewer = ({
    galleryId,
    initialImage,
  }: {
    galleryId: number;
    initialImage: Image;
  }) => {
    setGalleryId(galleryId);
    setInitialImage(initialImage);
    setIsOpen(true);
  };

  const closeViewer = () => {
    setGalleryId(null);
    setInitialImage(null);
    setIsOpen(false);
  };

  return (
    <ImageViewerContext.Provider
      value={{
        galleryId,
        initialImage,
        isOpen,
        openViewer,
        closeViewer,
      }}
    >
      {children}
    </ImageViewerContext.Provider>
  );
};

export const useImageViewer = () => {
  const context = useContext(ImageViewerContext);
  return context;
};
