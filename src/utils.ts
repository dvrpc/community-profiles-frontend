import { countyInfoMap } from "./consts";

export function getFipsFromCountyName(county: keyof typeof countyInfoMap) {
    return countyInfoMap[county]
}