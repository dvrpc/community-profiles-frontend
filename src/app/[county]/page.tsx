import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCounties, getLocality } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { titleCase } from "@/lib/utils";
import HeroMap from "@/components/Hero/HeroMap";
import { REMAINING_VIEWPORT_HEIGHT_PROPERTY } from "@/consts";
import Hero from "@/components/Hero/Hero";

export default async function County(props: Params) {
  const params = await props.params;
  const county = getLocality(params.county);

  if (!county) {
    return notFound();
  }

  const content = await markdownToHtml(county.content || "");

  return (
    <div>
      {/* {titleCase(params.county)} */}
      <Hero />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

type Params = {
  params: Promise<{
    county: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const county = getLocality(params.county);

  if (!county) {
    return notFound();
  }

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
