import { Image } from "../../services/useImages";

export const TimelinePage = ({ images }: { images: Image[] }) => {
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
