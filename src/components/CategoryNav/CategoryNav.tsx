"use client";
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
import { JSX, useEffect, useRef, useState } from "react";
import { categoryTitleMap } from "@/consts";

export default function CategoryNav() {
  // const [isPinned, setIsPinned] = useState(false);

  // const ref = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (ref.current) {
  //       const rect = ref.current.getBoundingClientRect();

  //       if (rect.top < 0 && !isPinned) {
  //         setIsPinned(true);
  //       }
  //       if (window.scrollY < window.innerHeight) {
  //         setIsPinned(false);
  //       }

  //       console.log(rect.bottom);
  //       console.log(window.scrollY);
  //       console.log(window.scrollY < window.innerHeight);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   // Initial check when component mounts
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  const iconHeight = "h-10";
  const iconMap: Record<CategoryKeys, JSX.Element> = {
    "demographics-housing": (
      <DemographicHousingIcon fill="white" className={iconHeight} />
    ),
    economy: <EconomyIcon fill="white" className={iconHeight} />,
    "active-transportation": (
      <ActiveTransportationIcon fill="white" className={iconHeight} />
    ),
    "safety-health": <SafetyHealthIcon fill="white" className={iconHeight} />,
    freight: <FreightIcon fill="white" className={iconHeight} />,
    environment: <EnvironmnentIcon fill="white" className={iconHeight} />,
    transit: <TransitIcon fill="white" className={iconHeight} />,
    roadways: <RoadwaysIcon fill="white" className={iconHeight} />,
  };

  const entries = getTypedObjectEntries(iconMap);

  //TODO: get sticky collapse to work properly
  return (
    <div
      // ref={ref}
      className="bg-dvrpc-blue-3 flex justify-center p-4 z-100000 sticky top-0"
    >
      <div className="grid grid-cols-8">
        {entries.map(([key, value]) => {
          return (
            <CategoryButton
              key={key}
              name={categoryTitleMap[key]}
              icon={value}
              href={`#${key}`}
              isPinned={false}
            />
          );
        })}
      </div>
    </div>
  );
}
