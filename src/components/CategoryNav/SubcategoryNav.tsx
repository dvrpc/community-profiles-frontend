import { SubcategoryTree } from "@/types/types";
import SubcategoryDropdown from "./SubcategoryDropdown";

interface Props {
  subcategories: SubcategoryTree[];
  isVisible: boolean;
  activeSubcategory: string;
}

export default function SubcategoryNav(props: Props) {
  const { subcategories, isVisible, activeSubcategory } = props;

  return (
    <div
      className={`flex bg-dvrpc-blue-1 text-white justify-center gap-4 transition-all duration-300 ease-out ${!isVisible ? "max-h-0" : "max-h-8"
        }`}
    >
      {isVisible && subcategories.map(subcategory => (
        <SubcategoryDropdown
          key={subcategory.id}
          subcategory={subcategory.name}
          topics={subcategory.topics}
          isActive={subcategory.name == activeSubcategory}
          navOpen={isVisible}
        />
      ))}
    </div>
  );
}
