import { LngLatBounds } from "mapbox-gl";
import { countyInfoMap, emptyCategoryMap, municipalityInfoMap } from "./consts";
import {
  getTypedObjectEntries,
  ProfileContent,
  SubcategoryKeyMap,
} from "./types";

export const titleCase = (str: string) =>
  str.replace(/-/g, " ").replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());

export function getCountyFromGeoid(geoid: string) {
  const county = Object.entries(countyInfoMap).find(
    (c) => c[1].geoid == parseInt(geoid)
  )?.[0];

  if (county) {
    return county[0].toUpperCase() + county.slice(1);
  }
  return "";
}

export function getMunicipalitySlugFromGeoid(county: string, geoid: string) {
  const countyMunicipaliies = municipalityInfoMap[county];
  const municipality = Object.entries(countyMunicipaliies).find(
    (m) => m[1].geoid == geoid
  )?.[0];
  return municipality ? municipality : "";
}

export function displayNumber(num: number) {
  return num.toLocaleString("en-US", {
    maximumFractionDigits: 1,
  });
}

export function parseBounds(buffer_box: string) {
  //POLYGON((-75.5172386174942 40.019966656385144,-75.52195819955206 40.635408512424895,-74.68232273049465 40.63615113388574,-74.68519528899041 40.020693387223744,-75.5172386174942 40.019966656385144))
  const allCoords = buffer_box.substring(9, buffer_box.length - 1).split(",");
  const sw = allCoords[0].split(" ").map(Number);
  const ne = allCoords[2].split(" ").map(Number);

  const swLngLat = {
    lng: sw[0],
    lat: sw[1],
  };

  const neLngLat = {
    lng: ne[0],
    lat: ne[1],
  };
  return new LngLatBounds(swLngLat, neLngLat);
}

export function displaySubcategoryTopicTitle(title: string) {
  return title
    .replace(/-/g, " ")
    .replace(/\band\b/gi, "&")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getAllCountyMunicipalityPairs() {
  const countyMunicipalityPairs: { county: string; municipality: string }[] =
    [];

  for (const [county, municipalities] of Object.entries(municipalityInfoMap)) {
    Object.keys(municipalities).forEach((muni) => {
      countyMunicipalityPairs.push({
        county: county,
        municipality: muni,
      });
    });
  }

  return countyMunicipalityPairs;
}

export function getCategoryKeyMap(content: ProfileContent) {
  const categoryMap = { ...emptyCategoryMap };

  getTypedObjectEntries(content).forEach(([cat, subcatContent]) => {
    const subcategoryMap: SubcategoryKeyMap = {};

    Object.entries(subcatContent).forEach(([subcat, topicContent]) => {
      const topics: string[] = [];
      topicContent.forEach((topic) => {
        topics.push(topic.name);
      });
      subcategoryMap[subcat] = topics;
    });

    categoryMap[cat] = subcategoryMap;
  });
  return categoryMap;
}
