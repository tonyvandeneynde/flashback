import { styled } from "@mui/material";
import { Folder, Gallery } from "../../apiConstants";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";

const StyledBreadcrumb = styled("span")`
  cursor: pointer;
  color: ${({ theme }) => theme.palette.primary.main};
  display: flex;
  align-items: center;
`;

const StyledBreadcrumbBar = styled("div")`
  display: flex;
  gap: 8px;
  padding: 8px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  align-items: center;
`;

const StyledHomeIcon = styled(HomeIcon)`
  :hover {
    scale: 1.1;
  }
`;

const StyledBreadcrumbName = styled("span")`
  :hover {
    text-decoration: underline;
    scale: 1.1;
  }
`;

export const BreadcrumbBar = ({
  path,
  onClick,
}: {
  path: (Folder | Gallery)[];
  onClick: (node: Folder | Gallery) => void;
}) => {
  return (
    <StyledBreadcrumbBar>
      {path.map((node, index) => (
        <StyledBreadcrumb key={node.id} onClick={() => onClick(node)}>
          {index === 0 ? (
            <StyledHomeIcon />
          ) : (
            <>
              <ChevronRightIcon />
              <StyledBreadcrumbName>{node.name}</StyledBreadcrumbName>
            </>
          )}
        </StyledBreadcrumb>
      ))}
    </StyledBreadcrumbBar>
  );
};
