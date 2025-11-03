import Content from "@/components/Content/Content";
import Hero from "@/components/Hero/Hero";
import { API_BASE_URL } from "@/consts";
import { ProfileContent, ProfileData } from "@/types";
import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";

export default async function Home() {
  const regionResponse = await fetch(`${API_BASE_URL}/profile/region`);
  const regionData = (await regionResponse.json()) as ProfileData;
  const contentResponse = await fetch(`${API_BASE_URL}/content/region`);
  const content = (await contentResponse.json()) as ProfileContent;

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
        <Content content={content} data={regionData} geoLevel="region" />
      </main>
      <Footer />
    </>
  );
}
