import { Box, styled } from "@mui/material";
import { ReactNode } from "react";
import ImageViewer from "../ImageViewer/ImageViewer";
import { HeaderContainer } from "./Header/HeaderContainer";

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const StyledChildren = styled("div")<{ containPage: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: ${({ containPage }) => (containPage ? "hidden" : "visible")};
`;

export const MainLayout = ({
  children,
  containPage,
}: {
  children: ReactNode;
  containPage: boolean;
}) => {
  return (
    <StyledBox>
      <HeaderContainer />
      <StyledChildren containPage={containPage}>{children}</StyledChildren>
      <ImageViewer />
    </StyledBox>
  );
};
