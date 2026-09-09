"use client";

import { countyInfoMap, municipalityInfoMap } from "@/consts";
import { GeoLevel } from "@/types/types";
import { useEffect } from "react";
import Select, { SingleValue } from "react-select";

type GeographyOption = { value: string; label: string };

interface Props {
  geoLevel: GeoLevel;
  geoid: string | undefined;
  setGeoid: (geoid: string) => void;
}

const countyOptions: GeographyOption[] = Object.values(countyInfoMap).map(
  ({ geoid, label }) => ({ value: String(geoid), label }),
);

const municipalityOptions: GeographyOption[] = Object.values(
  municipalityInfoMap,
)
  .flatMap((municipalities) => Object.values(municipalities))
  .map(({ geoid, label }) => ({ value: geoid, label }))
  .sort((a, b) => a.label.localeCompare(b.label));

export default function GeographySelect({ geoLevel, geoid, setGeoid }: Props) {
  const options = geoLevel === "county" ? countyOptions : municipalityOptions;
  const selectedOption = options.find((option) => option.value === geoid);

  useEffect(() => {
    if (geoLevel !== "region" && !selectedOption && options[0]) {
      setGeoid(options[0].value);
    }
  }, [geoLevel, options, selectedOption, setGeoid]);

  if (geoLevel === "region") return null;

  function handleChange(option: SingleValue<GeographyOption>) {
    if (option) setGeoid(option.value);
  }

  return (
    <div className="mt-3">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-dvrpc-blue-1">
        {geoLevel === "county" ? "County" : "Municipality"}
      </label>
      <Select<GeographyOption, false>
        instanceId="admin-geography-select"
        options={options}
        value={selectedOption ?? options[0]}
        onChange={handleChange}
        placeholder={`Select a ${geoLevel}...`}
        isSearchable
      />
    </div>
  );
}
