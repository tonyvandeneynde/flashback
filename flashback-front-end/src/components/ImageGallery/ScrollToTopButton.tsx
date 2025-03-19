import { styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const StyledButton = styled("button")`
  position: fixed;
  bottom: 16px;
  right: 16px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: white;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.dark};
    scale: 1.05;
  }
`;

export const ScrollToTopButton = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const toggleVisibility = () => {
    if (window.innerHeight < 2 * window.scrollY) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {showScrollToTop ? (
        <StyledButton onClick={scrollToTop}>
          <Typography>Back to top</Typography>
        </StyledButton>
      ) : null}
    </>
  );
};
