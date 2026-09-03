import Content from "@/components/Content/Content";
import Hero from "@/components/Hero/Hero";
import { API_BASE_URL } from "@/consts";
import { Category, RegionProfile } from "@/types/types";
import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";

export default async function Home() {
  const regionResponse = await fetch(`${API_BASE_URL}/profile/region`, {
    next: { tags: ["region"] },
  });
  const regionData = (await regionResponse.json()) as RegionProfile;

  const contentTreeResponse = await fetch(`${API_BASE_URL}/content/region`, {
    next: { tags: ["region"] },
  });
  const contentTree = (await contentTreeResponse.json()) as Category[];
  return (
    <>
      <Header />
      <Nav />
      <main>
        <Hero
          title={"Greater Philadelphia"}
          profileData={regionData}
          geoLevel="region"
        />
        <Content
          contentTree={contentTree}
          profileData={regionData}
          geoLevel="region"
        />
      </main>
      <Footer />
    </>
  );
}
