import { MainLayout } from "../layout";
import { SiteContainer } from "../Site/SiteContainer";

export const SitePage = ({ path }: { path: string[] }) => {
  return (
    <MainLayout containPage={false}>
      <SiteContainer path={path} />
    </MainLayout>
  );
};
