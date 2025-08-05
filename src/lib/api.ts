import { County } from "@/interfaces/county";
import { Municipality } from "@/interfaces/municipality";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const countyDirectory = join(process.cwd(), "_counties");
const municipalityDirectory = join(process.cwd(), "_municipalities");

export function getCountySlugs() {
  return fs.readdirSync(countyDirectory);
}

export function getMunicipalitySlugs() {
  return fs.readdirSync(municipalityDirectory);
}

export function getLocality(county: string, municipality?: string) {
  const directory = !municipality ? countyDirectory : municipalityDirectory;
  const realSlug = !municipality
    ? county.replace(/\.md$/, "")
    : municipality.replace(/\.md$/, "");
  const fullPath = join(directory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    ...data,
    county: county,
    content,
    ...(municipality && { municipality: municipality }),
  };
}

export function getAllCounties(): County[] {
  const slugs = getCountySlugs();
  const counties = slugs.map((slug) => getLocality(slug));
  return counties;
}

export function getAllMunicipalities(county: string): Municipality[] {
  const slugs = getMunicipalitySlugs();
  const municipalities = slugs.map((municipality) =>
    getLocality(county, municipality),
  );
  return municipalities;
}
