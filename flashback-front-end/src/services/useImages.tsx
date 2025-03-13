import { useEffect, useState } from "react";

export interface Image {
  id: number;
  filename: string;
  originalPath: string;
  mediumPath: string;
  thumbnailPath: string;
  tags: string[];
}

export const useImages = () => {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch("api/images");
      const data = await response.json();
      setImages(data);
    };
    fetchImages();
  }, []);

  return { images };
};
