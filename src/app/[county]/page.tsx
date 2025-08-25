import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCounties, getCounty } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { titleCase } from "@/lib/utils";
import HeroMap from "@/components/Hero/HeroMap";
import { countyInfoMap, REMAINING_VIEWPORT_HEIGHT_PROPERTY } from "@/consts";
import Hero from "@/components/Hero/Hero";
import { getFipsFromCountyName } from "@/utils";
import { CountyData, CountySlug } from "@/types";
import CategoryNav from "@/components/CategoryNav/CategoryNav";

interface Params {
  params: Promise<{
    county: CountySlug;
  }>;
};

export default async function County(props: Params) {
  const params = await props.params;
  // const county = getLocality(params.county);

  // if (!county) {
  //   return notFound();
  // }

  const countyName = countyInfoMap[params.county].label
  const countyFips = countyInfoMap[params.county].fips
  const response = await fetch('http://127.0.0.1:8000/profile/county/' + countyFips)
  const countyData = await response.json() as CountyData

  // const content = await markdownToHtml(county.content || "");

  return (
    <div>
      {/* {titleCase(params.county)} */}
      <Hero geographyName={countyName} profileData={countyData} />
      <CategoryNav />
      {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
    </div>
  );
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  // const county = getCounty(params.county);


  const title = `${titleCase(params.county)}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

export async function generateStaticParams(props: Params) {
  const counties = getAllCounties();

  return counties.map((county) => ({
    slug: county.slug,
  }));
}
