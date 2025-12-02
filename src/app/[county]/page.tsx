import { Metadata } from "next";
import { titleCase } from "@/utils";
import { API_BASE_URL, countyInfoMap } from "@/consts";
import Hero from "@/components/Hero/Hero";
import { ProfileContent, CountySlug, ProfileData } from "@/types/types";
import Content from "@/components/Content/Content";
import Footer from "../Footer";
import SmallHeader from "../SmallHeader";

interface Params {
  params: Promise<{
    county: CountySlug;
  }>;
}

export default async function County(props: Params) {
  const params = await props.params;

  const countyName = countyInfoMap[params.county].label;
  const geoid = countyInfoMap[params.county].geoid;
  const profileResponse = await fetch(
    `${API_BASE_URL}/profile/county/${geoid}`, { next: { tags: ['county'] } }
  );
  const countyData = (await profileResponse.json()) as ProfileData;
  const contentResponse = await fetch(
    `${API_BASE_URL}/content/county/${geoid}`, { next: { tags: ['county'] } }
  );
  const content = (await contentResponse.json()) as ProfileContent;

  return (
    <>
      <SmallHeader />
      <main>
        <Hero
          title={countyName}
          profileData={countyData}
          geoLevel="county"
        />
        <Content content={content} data={countyData} geoLevel="county" />
      </main>
      <Footer />

    </>
  );
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;

  const title = `${titleCase(params.county)} County`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}
