import { styled } from "@mui/material";
import { Folder, Gallery, isFolder } from "../../apiConstants";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";

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
  margin-left: 8px;
`;

const StyledNodeContainer = styled("div")`
  margin-left: 8px;
  display: flex;
  align-items: center;
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
              <StyledNodeContainer>
                {isFolder(node) ? <FolderIcon /> : <PhotoLibraryIcon />}
                <StyledBreadcrumbName>{node.name}</StyledBreadcrumbName>
              </StyledNodeContainer>
            </>
          )}
        </StyledBreadcrumb>
      ))}
    </StyledBreadcrumbBar>
  );
};
