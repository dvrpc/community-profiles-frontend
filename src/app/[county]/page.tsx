import { Metadata } from "next";
import { notFound } from "next/navigation";
import markdownToHtml from "@/lib/markdownToHtml";
import { titleCase } from "@/lib/utils";
import HeroMap from "@/components/Hero/HeroMap";
import { countyInfoMap, REMAINING_VIEWPORT_HEIGHT_PROPERTY } from "@/consts";
import Hero from "@/components/Hero/Hero";
import { CountyData, CountySlug } from "@/types";
import CategoryNav from "@/components/CategoryNav/CategoryNav";
import { getCountyContent } from "@/lib/content";
import CategorySection from "@/components/CategorySection/CategorySection";

interface Params {
  params: Promise<{
    county: CountySlug;
  }>;
}

export default async function County(props: Params) {
  const params = await props.params;
  // const county = getLocality(params.county);

  // if (!county) {
  //   return notFound();
  // }

  const countyName = countyInfoMap[params.county].label;
  const geoid = countyInfoMap[params.county].geoid;
  const response = await fetch("http://127.0.0.1:8000/profile/county/" + geoid);
  const countyData = (await response.json()) as CountyData;

  const content = await getCountyContent(countyData);

  console.log(content);
  return (
    <div>
      {/* {titleCase(params.county)} */}
      <Hero
        geographyName={countyName}
        profileData={countyData}
        geoLevel="county"
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
  // const county = getCounty(params.county);

  const title = `${titleCase(params.county)} County`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}
