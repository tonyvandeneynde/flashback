import { useImages } from "../../services/useImages";

export const TimelinePage = () => {
  const { data: images, isLoading } = useImages();

  if (!images || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Timeline</h1>
      <ul>
        {images.map((image) => (
          <li key={image.id}>
            <img src={`${image.thumbnailPath}`} alt={image.filename} />
          </li>
        ))}
      </ul>
    </div>
  );
};
