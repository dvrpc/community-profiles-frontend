import { Metadata } from "next";
import { notFound } from "next/navigation";
import { titleCase } from "@/lib/utils";
import Hero from "@/components/Hero/Hero";
import CategoryNav from "@/components/CategoryNav/CategoryNav";
import { municipalityInfoMap } from "@/consts";
import {
  Content,
  CountySlug,
  MunicipalityData,
  MunicipalitySlug,
} from "@/types";
import CategorySection from "@/components/CategorySection/CategorySection";
import { getAllCountyMunicipalityPairs } from "@/lib/api";

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
  const content = (await contentResponse.json()) as Content[];

  return (
    <div>
      <Hero
        geographyName={munName}
        profileData={municipalityData}
        geoLevel="municipality"
      />
      <CategoryNav />
      <div>
        {content.map((c) => {
          return (
            <CategorySection
              key={c.category}
              category={c.category}
              content={c.content}
              visualizations={c.visualizations}
              profileData={municipalityData}
              geoLevel="municipality"
            />
          );
        })}
      </div>
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
