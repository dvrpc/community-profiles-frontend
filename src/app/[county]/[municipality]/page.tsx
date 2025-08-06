import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllMunicipalities, getLocality } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { titleCase } from "@/lib/utils";

export default async function Municipality(props: Params) {
  const params = await props.params;
  const municipality = getLocality(params.county, params.municipality);

  if (!municipality) {
    return notFound();
  }

  const content = await markdownToHtml(municipality.content || "");

  return (
    <>
      {titleCase(params.county)} {titleCase(params.municipality)}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
}

type Params = {
  params: Promise<{
    county: string;
    municipality: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const municipality = getLocality(params.county, params.municipality);

  if (!municipality) {
    return notFound();
  }

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
