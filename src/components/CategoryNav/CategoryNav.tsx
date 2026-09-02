"use client";
import {
  Category,
  CategoryKeyMap,
  CategoryKeys,
  GeoLevel,
  getTypedObjectEntries,
} from "@/types/types";
import ActiveTransportationIcon from "../Icons/ActiveTransportationIcon";
import DemographicHousingIcon from "../Icons/DemographicHousingIcon";
import EconomyIcon from "../Icons/EconomyIcon";
import EnvironmnentIcon from "../Icons/EnvironmentIcon";
import FreightIcon from "../Icons/FreightIcon";
import RoadwaysIcon from "../Icons/RoadwaysIcon";
import SafetyHealthIcon from "../Icons/SafetyHealthIcon";
import TransitIcon from "../Icons/TransitIcon";
import CategoryButton from "./CategoryButton";
import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { categoryTitleMap } from "@/consts";
import { useScrollContext } from "@/context/ScrollProvider";
import SubcategoryNav from "./SubcategoryNav";
import { useTree } from "@/lib/hooks";

interface Props {
  geoLevel: GeoLevel;
}
export default function CategoryNav(props: Props) {
  const { activeCategoryId, activeSubcategoryId } = useScrollContext();
  const stickyRef = useRef(null);
  const [isPinned, setIsPinned] = useState(false);
  const { geoLevel } = props;

  const { data: tree = [] } = useTree(geoLevel);

  const iconHeight = "h-10";
  const iconMap: Record<number, JSX.Element> = {
    1: <DemographicHousingIcon fill="white" className={iconHeight} />,
    2: <EconomyIcon fill="white" className={iconHeight} />,
    3: <ActiveTransportationIcon fill="white" className={iconHeight} />,
    4: <SafetyHealthIcon fill="white" className={iconHeight} />,
    5: <FreightIcon fill="white" className={iconHeight} />,
    6: <EnvironmnentIcon fill="white" className={iconHeight} />,
    7: <TransitIcon fill="white" className={iconHeight} />,
    8: <RoadwaysIcon fill="white" className={iconHeight} />,
  };

  useEffect(() => {
    if (!stickyRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPinned(entry.intersectionRatio < 1);
      },
      {
        threshold: [1],
      },
    );

    observer.observe(stickyRef.current);

    return () => {
      if (stickyRef.current) {
        observer.unobserve(stickyRef.current);
      }
    };
  }, []);

  const subcategories = useMemo(() => {
    const foundSubcats = tree.find(
      (category) => category.id === activeCategoryId,
    )?.subcategories;
    return foundSubcats ? foundSubcats : [];
  }, [activeCategoryId, tree]);
  return (
    <div
      ref={stickyRef}
      className="bg-dvrpc-blue-3 flex flex-col z-100000 sticky top-[-1px]"
    >
      <div className={`justify-center px-4 pt-4 grid grid-cols-8`}>
        {tree.map((category) => {
          return (
            <CategoryButton
              key={category.id}
              name={category.label}
              icon={iconMap[category.id]}
              href={`#${category.url_id}`}
              isActive={isPinned && activeCategoryId === category.id}
            />
          );
        })}
      </div>
      <SubcategoryNav
        isVisible={isPinned}
        subcategories={subcategories}
        activeSubcategoryId={activeSubcategoryId}
      />
    </div>
  );
}
