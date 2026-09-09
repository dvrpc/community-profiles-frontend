import { Metadata } from "next";
import { titleCase } from "@/utils";
import Hero from "@/components/Hero/Hero";
import { API_BASE_URL, municipalityInfoMap } from "@/consts";
import {
  CountySlug,
  MunicipalitySlug,
  MunicipalityProfile,
  Category,
} from "@/types/types";
import { getAllCountyMunicipalityPairs } from "@/utils";
import Content from "@/components/Content/Content";
import Footer from "@/app/Footer";
import SmallHeader from "@/app/SmallHeader";

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
    `${API_BASE_URL}/profile/municipality/${geoid}`,
    { next: { tags: ["municipality"] } },
  );
  const municipalityData =
    (await profileResponse.json()) as MunicipalityProfile;

  const contentTreeResponse = await fetch(
    `${API_BASE_URL}/content/municipality/${geoid}`,
    {
      next: { tags: ["region"] },
    },
  );
  const contentTree = (await contentTreeResponse.json()) as Category[];
  return (
    <>
      <SmallHeader />
      <main>
        <Hero
          title={munName}
          profileData={municipalityData}
          geoLevel="municipality"
        />
        <Content
          contentTree={contentTree}
          profileData={municipalityData}
          geoLevel="municipality"
        />
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;

  const title = `${titleCase(params.county)} | ${titleCase(
    params.municipality,
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
