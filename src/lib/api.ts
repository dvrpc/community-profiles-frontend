import { countyInfoMap, municipalityInfoMap } from "@/consts";
import { County } from "@/interfaces/county";
import { Municipality } from "@/interfaces/municipality";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const markdownDirectiory = join(process.cwd(), "markdown");

export function getCounty(county: string) {
  const fullPath = join(markdownDirectiory, 'county.md');
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    ...data,
    slug: county,
    county: county,
    content,
  };
}

export function getMunicipality(county: string, municipality: string) {
  const fullPath = join(markdownDirectiory, 'municipality.md');
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    ...data,
    slug: municipality,
    county: county,
    municipality: municipality,
    content,
  };
}

export function getAllCounties(): County[] {
  const counties = Object.keys(countyInfoMap)
  const slugs = counties.map((slug) => getCounty(slug));
  // return counties;
  return slugs;
}

export function getAllMunicipalities(county: string): Municipality[] {
  console.log(county)

  const municipalities = Object.keys(municipalityInfoMap[county])
  const slugs = municipalities.map((slug) => getMunicipality(county, slug));

  return slugs;
}
