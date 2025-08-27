import { CATEGORIES } from "@/consts";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import markdownToHtml from "./markdownToHtml";
import { CategoryKeys, CountyData, MunicipalityData } from "@/types";

const countyMarkdownDirectiory = join(process.cwd(), "markdown/county");
const municipalityMarkdownDirectory = join(
  process.cwd(),
  "markdown/municipality"
);

interface CategoryContent {
  category: CategoryKeys;
  content: string;
}

export async function getContent(directory: string) {
  const categoryContent: CategoryContent[] = [];

  await CATEGORIES.forEach(async (cat) => {
    const fullPath = join(directory, `${cat}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { content } = matter(fileContents);
    const html = await markdownToHtml(content);
    categoryContent.push({
      category: cat,
      content: html,
    });
  });
  return categoryContent;
}

//TODO: Populate with variables
export function getCountyContent(countyData: CountyData) {
  return getContent(countyMarkdownDirectiory);
}

export function getMunicipalityContent(municipalityData: MunicipalityData) {
  return getContent(municipalityMarkdownDirectory);
}
