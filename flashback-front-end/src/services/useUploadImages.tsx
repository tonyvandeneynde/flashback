import { useState } from "react";
import { API_PREFIX, IMAGES, IMAGES_BY_GALLERY } from "../apiConstants";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useUploadImages = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadImages = async (galleryId: number, files: File[]) => {
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("galleryId", galleryId.toString());

      const response = await axios.post(`${API_PREFIX}/${IMAGES}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        queryClient.invalidateQueries({
          queryKey: [`${API_PREFIX}/${IMAGES_BY_GALLERY}/${galleryId}`],
        });
      } else {
        throw new Error("Failed to upload images");
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, uploadImages };
};
