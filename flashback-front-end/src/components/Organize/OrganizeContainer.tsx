import { OrganizeContextProvider } from "../../contexts/OrganizeContext";
import { styled } from "@mui/material";
import theme from "../../theme/theme";
import { FolderTreeContainer } from "./FolderTreeContainer";
import { ContentContainer } from "./ContentContainer";
import { OrganizeToolbar } from "./OrganizeToolbar";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`;

const Header = styled("div")`
  padding: 16px;
  background-color: ${theme.palette.background.paper};
  border-bottom: 1px solid ${theme.palette.divider};
`;

const Title = styled("h1")`
  margin: 0;
  font-size: 24px;
`;

const Toolbar = styled("div")`
  padding: 8px;
  background-color: ${theme.palette.background.paper};
  border-bottom: 1px solid ${theme.palette.divider};
`;

const MainContent = styled("div")`
  display: flex;
  flex: 1;
`;

const TreeSection = styled("div")`
  width: 250px;
  padding: 16px;
  background-color: ${theme.palette.background.paper};
  border-right: 1px solid ${theme.palette.divider};
`;

const ContentSection = styled("div")`
  flex: 1;
  padding: 16px;
`;

export const OrganizeContainer = () => {
  return (
    <OrganizeContextProvider>
      <Container>
        <Header>
          <Title>Organize</Title>
        </Header>
        <Toolbar>
          <OrganizeToolbar />
        </Toolbar>
        <MainContent>
          <TreeSection>
            <FolderTreeContainer />
          </TreeSection>
          <ContentSection>
            <ContentContainer />
          </ContentSection>
        </MainContent>
      </Container>
    </OrganizeContextProvider>
  );
};
