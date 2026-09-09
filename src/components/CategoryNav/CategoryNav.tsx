"use client";
import { GeoLevel } from "@/types/types";
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
import { useScrollContext } from "@/context/ScrollProvider";
import SubcategoryNav from "./SubcategoryNav";
import { useTree } from "@/lib/hooks";

interface Props {
  geoLevel: GeoLevel;
}
export default function CategoryNav(props: Props) {
  const { activeCategoryId, activeSubcategoryId } = useScrollContext();
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [displayedCategoryId, setDisplayedCategoryId] = useState(activeCategoryId);
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
    if (!stickySentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPinned(!entry.isIntersecting);
      },
    );

    observer.observe(stickySentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const subcategories = useMemo(() => {
    const foundSubcats = tree.find(
      (category) => category.id === displayedCategoryId,
    )?.subcategories;
    return foundSubcats ? foundSubcats : [];
  }, [displayedCategoryId, tree]);

  useEffect(() => {
    // Keep the last valid category visible while scroll tracking updates the
    // active IDs. This prevents a transient unmatched ID from collapsing the
    // pinned subcategory nav.
    if (tree.some((category) => category.id === activeCategoryId)) {
      setDisplayedCategoryId(activeCategoryId);
    }
  }, [activeCategoryId, tree]);
  return (
    <>
      <div ref={stickySentinelRef} className="h-px" aria-hidden="true" />
      <div className="bg-dvrpc-blue-3 flex flex-col z-100000 sticky top-[-1px]">
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
    </>
  );
}
