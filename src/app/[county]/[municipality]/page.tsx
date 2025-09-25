import { Metadata } from "next";
import { titleCase } from "@/utils";
import Hero from "@/components/Hero/Hero";
import { municipalityInfoMap } from "@/consts";
import {
  ProfileContent,
  CountySlug,
  MunicipalityData,
  MunicipalitySlug,
} from "@/types";
import Category from "@/components/Content/Category";
import { getAllCountyMunicipalityPairs } from "@/utils";
import Content from "@/components/Content/Content";

type Params = {
  params: Promise<{
    county: CountySlug;
    municipality: MunicipalitySlug;
  }>;
};

export default async function Municipality(props: Params) {
  const params = await props.params;

  const munName = municipalityInfoMap[params.county][params.municipality].label;
  const geoid = municipalityInfoMap[params.county][params.municipality].geoid;
  const profileResponse = await fetch(
    "http://127.0.0.1:8000/profile/municipality/" + geoid
  );
  const municipalityData = (await profileResponse.json()) as MunicipalityData;
  const contentResponse = await fetch(
    "http://127.0.0.1:8000/content/municipality/" + geoid
  );
  const content = (await contentResponse.json()) as ProfileContent;

  return (
    <div>
      <Hero
        geographyName={munName}
        profileData={municipalityData}
        geoLevel="municipality"
      />
      <Content
        content={content}
        data={municipalityData}
        geoLevel="municipality"
      />
    </div>
  );
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;

  const title = `${titleCase(params.county)} | ${titleCase(
    params.municipality
  )}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

export async function generateStaticParams() {
  return getAllCountyMunicipalityPairs();
}
