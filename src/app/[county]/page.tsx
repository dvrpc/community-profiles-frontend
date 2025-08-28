import { Metadata } from "next";
import { titleCase } from "@/lib/utils";
import { countyInfoMap } from "@/consts";
import Hero from "@/components/Hero/Hero";
import { Content, CountyData, CountySlug } from "@/types";
import CategoryNav from "@/components/CategoryNav/CategoryNav";
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
  const profileResponse = await fetch(
    "http://127.0.0.1:8000/profile/county/" + geoid
  );
  const countyData = (await profileResponse.json()) as CountyData;
  const contentResponse = await fetch(
    "http://127.0.0.1:8000/content/county/" + geoid
  );
  const content = (await contentResponse.json()) as Content[];

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
