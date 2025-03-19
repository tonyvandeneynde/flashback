import { MainLayout } from "../../layout";
import { OrganizeContainer } from "../../Organize/OrganizeContainer";

export const OrganizePage = () => {
  return (
    <MainLayout containPage={true}>
      <OrganizeContainer />
    </MainLayout>
  );
};
