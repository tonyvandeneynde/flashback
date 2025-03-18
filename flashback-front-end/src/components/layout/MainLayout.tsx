import { Box } from "@mui/material";
import { ReactNode } from "react";
import { Header } from "./Header";
import ImageViewer from "../ImageViewer/ImageViewer";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box>
      <Header />
      <div>{children}</div>
      <ImageViewer />
    </Box>
  );
};
