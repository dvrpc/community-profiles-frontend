import Hero from "@/components/Hero/Hero";
import { API_BASE_URL } from "@/consts";
import { ProfileContent, RegionData } from "@/types";

export default async function Home() {

  const regionResponse = await fetch(
    `${API_BASE_URL}/profile/region`
  );
  const countyData = (await regionResponse.json()) as RegionData;
  const contentResponse = await fetch(
    `${API_BASE_URL}/content/region`
  );
  const content = (await contentResponse.json()) as ProfileContent;

  return (
    <div>
      <Hero
        geographyName={'DVRPC Region'}
        profileData={countyData}
        geoLevel="county"
      />
      <Content content={content} data={countyData} geoLevel="county" />
    </div>
  );
}
