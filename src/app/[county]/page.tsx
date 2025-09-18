import { Metadata } from "next";
import { titleCase } from "@/lib/utils";
import { countyInfoMap } from "@/consts";
import Hero from "@/components/Hero/Hero";
import { ProfileContent, CountyData, CountySlug } from "@/types";
import CategoryNav from "@/components/CategoryNav/CategoryNav";
import Content from "@/components/Content/Content";

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
    "http://127.0.0.1:8000/profile/county/" + geoid
  );
  const countyData = (await profileResponse.json()) as CountyData;
  const contentResponse = await fetch(
    "http://127.0.0.1:8000/content/county/" + geoid
  );
  const content = (await contentResponse.json()) as ProfileContent[];

  return (
    <div>
      <Hero
        geographyName={countyName}
        profileData={countyData}
        geoLevel="county"
      />
      <CategoryNav />
      <Content content={content} data={countyData} geoLevel="county" />
    </div>
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
