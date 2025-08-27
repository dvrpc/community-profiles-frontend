import { municipalityInfoMap } from "@/consts";

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
