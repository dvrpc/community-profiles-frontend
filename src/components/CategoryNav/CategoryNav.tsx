"use client";
import { CategoryKeyMap, CategoryKeys, getTypedObjectEntries } from "@/types/types";
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
import { useScrollContext } from "@/context/ScrollProvider";
import SubcategoryNav from "./SubcategoryNav";

interface Props {
  categoryKeyMap: CategoryKeyMap;
}
export default function CategoryNav(props: Props) {
  const { activeCategory, activeSubcategory } = useScrollContext();
  const stickyRef = useRef(null);
  const [isPinned, setIsPinned] = useState(false);
  const { categoryKeyMap } = props;

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

  useEffect(() => {
    if (!stickyRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPinned(entry.intersectionRatio < 1);
      },
      {
        threshold: [1],
      }
    );

    observer.observe(stickyRef.current);

    return () => {
      if (stickyRef.current) {
        observer.unobserve(stickyRef.current);
      }
    };
  }, []);


  return (
    <div
      ref={stickyRef}
      className="bg-dvrpc-blue-3 flex flex-col z-100000 sticky top-[-1px]"
    >
      <div className={`justify-center px-4 pt-4 grid grid-cols-8`}>
        {entries.map(([key, value]) => {
          return (
            <CategoryButton
              key={key}
              name={categoryTitleMap[key]}
              icon={value}
              href={`#${key}`}
              isActive={isPinned && activeCategory == key}
            />
          );
        })}
      </div>
      <SubcategoryNav
        isVisible={isPinned}
        subcategories={categoryKeyMap[activeCategory].subcategories}
        activeSubcategory={activeSubcategory}
      />
    </div>
  );
}
