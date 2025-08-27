import { CategoryKeys, getTypedObjectEntries } from "@/types";
import ActiveTransportationIcon from "../Icons/ActiveTransportationIcon";
import DemographicHousingIcon from "../Icons/DemographicHousingIcon";
import EconomyIcon from "../Icons/EconomyIcon";
import EnvironmnentIcon from "../Icons/EnvironmentIcon";
import FreightIcon from "../Icons/FreightIcon";
import RoadwaysIcon from "../Icons/RoadwaysIcon";
import SafetyHealthIcon from "../Icons/SafetyHealthIcon";
import TransitIcon from "../Icons/TransitIcon";
import CategoryButton from "./CategoryButton";
import { JSX } from "react";
import { categoryTitleMap } from "@/consts";

const iconMap: Record<CategoryKeys, JSX.Element> = {
  "demographics-housing": (
    <DemographicHousingIcon fill="white" className="h-18" />
  ),
  economy: <EconomyIcon fill="white" className="h-18" />,
  "active-transportation": (
    <ActiveTransportationIcon fill="white" className="h-18" />
  ),
  "safety-health": <SafetyHealthIcon fill="white" className="h-18" />,
  freight: <FreightIcon fill="white" className="h-18" />,
  environment: <EnvironmnentIcon fill="white" className="h-18" />,
  transit: <TransitIcon fill="white" className="h-18" />,
  roadways: <RoadwaysIcon fill="white" className="h-18" />,
};

const entries = getTypedObjectEntries(iconMap);
export default function CategoryNav() {
  return (
    <div className="bg-dvrpc-blue-3 flex justify-center p-4">
      <div className="grid grid-cols-8">
        {entries.map(([key, value]) => {
          return (
            <CategoryButton
              key={key}
              name={categoryTitleMap[key]}
              icon={value}
              href={`#${key}`}
            />
          );
        })}
      </div>
    </div>
  );
}
