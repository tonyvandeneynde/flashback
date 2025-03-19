import { MainLayout } from "../../layout";
import { SiteContainer } from "../../Site/SiteContainer";

export const SitePage = () => {
  return (
    <MainLayout containPage={false}>
      <SiteContainer />
    </MainLayout>
  );
};
