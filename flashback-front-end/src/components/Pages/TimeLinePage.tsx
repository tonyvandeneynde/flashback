import { useImages } from "../../services";
import { ImageGallery } from "../ImageGallery/ImageGallery";

export const TimelinePage = () => {
  const imageData = useImages();
  return (
    <div>
      <h1>Timeline</h1>
      <ImageGallery {...imageData} />
    </div>
  );
};
