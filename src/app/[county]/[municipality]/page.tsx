import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllMunicipalities } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { titleCase } from "@/lib/utils";
import Hero from "@/components/Hero/Hero";
import CategoryNav from "@/components/CategoryNav/CategoryNav";
import { municipalityInfoMap } from "@/consts";
import { CountySlug, MunicipalityData, MunicipalitySlug } from "@/types";

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
  const munName = municipalityInfoMap[params.county][params.municipality].label
  const geoid = municipalityInfoMap[params.county][params.municipality].geoid
  const response = await fetch('http://127.0.0.1:8000/profile/municipality/' + geoid)
  const municipalityData = await response.json() as MunicipalityData

  return (
    <div>
      <Hero geographyName={munName} profileData={municipalityData} />
      <CategoryNav />
      {titleCase(params.county)} {titleCase(params.municipality)}
      {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
    </div>
  );
}



export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  // const municipality = getLocality(params.county, params.municipality);

  // if (!municipality) {
  //   return notFound();
  // }

  const title = `${titleCase(params.county)} | ${titleCase(params.municipality)}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

export async function generateStaticParams(props: Params) {
  const params = await props.params;

  const municipalities = getAllMunicipalities(params.county);

  return municipalities.map((municipality) => ({
    slug: municipality.slug,
  }));
}
