import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export interface StatusUpdate {
  status: "success" | "fail" | "processing";
  imageName: string;
  uploadId: string;
}

export const useImageProcessingStatus = ({
  onStatusUpdate,
}: {
  onStatusUpdate: (status: StatusUpdate) => void;
}) => {
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const handleStatusUpdate = (status: StatusUpdate) => {
    onStatusUpdate(status);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("uploadStatus", (data: StatusUpdate) => {
      if (data.uploadId !== uploadId) return;
      handleStatusUpdate(data);
      // Handle the upload status (e.g., update the UI)
    });

    return () => {
      socket.off("uploadStatus");
    };
  }, [uploadId]);

  useEffect(() => {
    const socket = io();
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { setUploadId };
};
