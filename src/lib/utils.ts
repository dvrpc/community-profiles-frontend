import { countyInfoMap, municipalityInfoMap } from "../consts";

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
