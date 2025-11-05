import { SubcategoryKeyMap } from "@/types/types";
import SubcategoryDropdown from "./SubcategoryDropdown";

interface Props {
  subcategoryKeyMap: SubcategoryKeyMap;
  isVisible: boolean;
  activeSubcategory: string;
}

export default function SubcategoryNav(props: Props) {
  const { subcategoryKeyMap, isVisible, activeSubcategory } = props;

  return (
    <div
      className={`flex bg-dvrpc-blue-1 text-white justify-center gap-4 transition-all duration-300 ease-out ${!isVisible ? "max-h-0" : "max-h-8"
        }`}
    >
      {isVisible && Object.entries(subcategoryKeyMap).map(([key, topics], index) => (
        <SubcategoryDropdown
          key={`${key}-${index}`}
          subcategory={key}
          topics={topics}
          isActive={key == activeSubcategory}
          navOpen={isVisible}
        />
      ))}
    </div>
  );
}
