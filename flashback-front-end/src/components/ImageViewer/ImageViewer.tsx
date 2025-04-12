import { Button, Dialog, styled } from "@mui/material";
import { useImageViewer } from "../../contexts/ImageViewerContext";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { useImagesByGallery } from "../../services";
import { Image } from "../../apiConstants";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";

const ViewerWrapper = styled("div")`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.palette.background.default};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ImageWrapper = styled("div")`
  position: relative;
`;

const StyledImage = styled("img")`
  max-width: 100vw;
  max-height: 100vh;
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 2;
`;

const ToggleScreenButton = styled(Button)`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  border-radius: 50%;
  z-index: 2;
`;

const NavButton = styled(Button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 2;
`;

const PrevButton = styled(NavButton)`
  left: 20px;
`;

const NextButton = styled(NavButton)`
  right: 20px;
`;

const ImageViewer = () => {
  const { isOpen, galleryId, initialImage, closeViewer } = useImageViewer();
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [images, setImages] = useState<Image[]>([]);
  const [nextImage, setNextImage] = useState<Image | null>(null);
  const [prevImage, setPrevImage] = useState<Image | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useImagesByGallery(galleryId);

  // useEffect(() => {
  //   if (isFullscreen) {
  //     dialogRef.current?.requestFullscreen();
  //   } else {
  //     document.exitFullscreen();
  //   }
  // }, [isFullscreen]);

  useEffect(() => {
    setCurrentImage(initialImage);
  }, [initialImage]);

  useEffect(() => {
    if (galleryId === null || !currentImage) return;

    if (status === "success" && !isFetchingNextPage) {
      const newImages = data.pages.flatMap((page) => page.data.images);

      setImages(newImages);

      // Fetch next page until the current image is included in the images
      // Also fetch if it is one of the last 5 images. This is to ensure that the user can scroll through the images without waiting for the next page to load
      if (!newImages.slice(0, -5).includes(currentImage) && hasNextPage) {
        fetchNextPage();
      }
    }
  }, [status, galleryId, currentImage]);

  useEffect(() => {
    if (!currentImage) return;

    const currentIndex = images.findIndex(
      (image) => image.id === currentImage.id
    );

    if (currentIndex > 0) {
      setPrevImage(images[currentIndex - 1]);
    } else {
      setPrevImage(null);
    }

    if (currentIndex < images.length - 1) {
      setNextImage(images[currentIndex + 1]);
    } else {
      setNextImage(null);
    }
  }, [currentImage, images]);

  const handlePrev = () => {
    setCurrentImage(prevImage);
  };

  const handleNext = () => {
    setCurrentImage(nextImage);
  };

  const handelClose = () => {
    setIsFullscreen(false);
    closeViewer();
  };

  if (!isOpen) {
    return null;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "ArrowRight" && nextImage) {
      handleNext();
    }
    if (event.key === "ArrowLeft" && prevImage) {
      handlePrev();
    }
    if (event.key === "Escape") {
      handelClose();
    }
  };

  return (
    <Dialog
      onKeyDown={handleKeyDown}
      ref={dialogRef}
      open={isOpen}
      fullScreen={true}
    >
      <ViewerWrapper>
        <CloseButton onClick={handelClose}>
          <CloseIcon />
        </CloseButton>
        {prevImage && (
          <PrevButton onClick={handlePrev}>
            <ChevronLeftIcon />
          </PrevButton>
        )}
        {nextImage && (
          <NextButton onClick={handleNext}>
            <ChevronRightIcon />
          </NextButton>
        )}
        <ToggleScreenButton onClick={() => setIsFullscreen(!isFullscreen)}>
          {isFullscreen ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
        </ToggleScreenButton>
        <ImageWrapper>
          <StyledImage
            src={currentImage?.originalPath}
            alt={`Image ${currentImage?.name}`}
          />
        </ImageWrapper>
      </ViewerWrapper>
    </Dialog>
  );
};

export default ImageViewer;
