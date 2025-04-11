import { OrganizeContextProvider } from "../../contexts/OrganizeContext";
import { styled } from "@mui/material";
import theme from "../../theme/theme";
import { FolderTreeContainer } from "./FolderTreeContainer";
import { ContentContainer } from "./ContentContainer";
import { OrganizeToolbar } from "./OrganizeToolbar";

const Container = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
`;

const Header = styled("div")`
  padding: 4px 0 4px 32px;
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
  flex-direction: row;
  flex: 1;
  overflow: hidden;
`;

const TreeSection = styled("div")`
  width: 250px;
  padding: 16px;
  background-color: ${theme.palette.background.paper};
  border-right: 1px solid ${theme.palette.divider};
`;

const ContentSection = styled("div")`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
  overflow: hidden;
`;

const StyledContentContainer = styled(ContentContainer)`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
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
            <StyledContentContainer />
          </ContentSection>
        </MainContent>
      </Container>
    </OrganizeContextProvider>
  );
};
