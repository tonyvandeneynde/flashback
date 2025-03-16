import { Box } from "@mui/material";
import { ReactNode } from "react";
import { Header } from "./Header";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box>
      <Header />
      <div>{children}</div>
    </Box>
  );
};
