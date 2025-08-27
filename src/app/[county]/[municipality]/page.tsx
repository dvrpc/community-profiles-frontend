import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMunicipalityContent } from "@/lib/content";
import markdownToHtml from "@/lib/markdownToHtml";
import { titleCase } from "@/lib/utils";
import Hero from "@/components/Hero/Hero";
import CategoryNav from "@/components/CategoryNav/CategoryNav";
import { municipalityInfoMap } from "@/consts";
import { CountySlug, MunicipalityData, MunicipalitySlug } from "@/types";
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
  // const municipality = getLocality(params.county, params.municipality);

  // if (!municipality) {
  //   return notFound();
  // }

  // const content = await markdownToHtml(municipality.content || "");
  const munName = municipalityInfoMap[params.county][params.municipality].label;
  const geoid = municipalityInfoMap[params.county][params.municipality].geoid;
  const response = await fetch(
    "http://127.0.0.1:8000/profile/municipality/" + geoid
  );
  const municipalityData = (await response.json()) as MunicipalityData;
  const content = await getMunicipalityContent(municipalityData);

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
              visualizations={undefined}
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
