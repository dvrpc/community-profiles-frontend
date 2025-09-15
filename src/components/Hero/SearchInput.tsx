"use client";
import Select, { OnChangeValue } from "react-select";

import { CSSProperties } from "react";
import { countyInfoMap, municipalityInfoMap } from "@/consts";
import { useRouter } from "next/navigation";

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const groupBadgeStyles: CSSProperties = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};

interface SelectOption {
  value: string;
  label: string;
  county?: string;
}

export interface GroupedOption {
  label: string;
  options: SelectOption[];
}

const countyOptions: SelectOption[] = Object.entries(countyInfoMap).map(
  ([key, value]) => {
    return {
      value: key,
      label: value.label,
    };
  }
);

const municipalityOptions: SelectOption[] = [];
Object.entries(municipalityInfoMap).forEach(([county, countyGroup]) => {
  Object.entries(countyGroup).map(([key, value]) => {
    municipalityOptions.push({
      value: key,
      label: value.label,
      county: county,
    });
  });
});

municipalityOptions.sort((a, b) => a.value.localeCompare(b.value));

const groupedOptions: readonly GroupedOption[] = [
  {
    label: "County",
    options: countyOptions,
  },
  {
    label: "Municipality",
    options: municipalityOptions,
  },
];

const formatGroupLabel = (data: GroupedOption) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

export default function SearchInput() {
  const router = useRouter();

  function handleSelect(e: OnChangeValue<SelectOption, false>) {
    if (!e) return;

    if (!e.county) {
      router.push("/" + e.value);
    } else {
      router.push(`/${e.county}/${e.value}`);
    }
  }

  return (
    <Select<SelectOption, false, GroupedOption>
      instanceId={"geo-search-select"}
      options={groupedOptions}
      formatGroupLabel={formatGroupLabel}
      onChange={handleSelect}
      placeholder="Select a county or municipality..."
    />
  );
}
