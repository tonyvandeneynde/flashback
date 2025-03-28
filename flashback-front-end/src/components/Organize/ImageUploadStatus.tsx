import { useEffect } from "react";
import io from "socket.io-client";

const ImageUploadStatus = () => {
  useEffect(() => {
    const socket = io();

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("uploadStatus", (data) => {
      console.log("Upload status:", data);
      // Handle the upload status (e.g., update the UI)
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.off("uploadStatus");
      socket.disconnect();
    };
  }, []);

  return <div>{/* Your component UI */}</div>;
};

export default ImageUploadStatus;
