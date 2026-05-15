import { LngLatBounds } from "mapbox-gl";
import { countyInfoMap, municipalityInfoMap } from "./consts";


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
  if (!num) return 0
  return num.toLocaleString("en-US", {
    maximumFractionDigits: 1,
  });
}

export function parseBounds(buffer_box: string) {
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

export function isValidUrl(url: string) {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(url);
}
