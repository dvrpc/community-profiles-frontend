import { countyInfoMap } from "./consts";

export function getFipsFromCountyName(county: keyof typeof countyInfoMap) {
    return countyInfoMap[county]
}

export function displayNumber(num: number) {
    return num.toLocaleString('en-US', {
        maximumFractionDigits: 1
    })
}