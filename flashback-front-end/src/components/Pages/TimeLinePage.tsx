import { useImages } from "../../services/useAllImages";
import ImageGallery from "../ImageGallery/ImageGallery";

export const TimelinePage = () => {
  const { data: images, isLoading } = useImages();

  if (!images || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Timeline</h1>
      <ImageGallery />
    </div>
  );
};
