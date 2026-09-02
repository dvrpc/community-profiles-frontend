import { Subcategory, SubcategoryTree } from "@/types/types";
import SubcategoryDropdown from "./SubcategoryDropdown";

interface Props {
  subcategories: Subcategory[];
  isVisible: boolean;
  activeSubcategoryId: number;
}

export default function SubcategoryNav(props: Props) {
  const { subcategories, isVisible, activeSubcategoryId } = props;

  return (
    <div
      className={`flex bg-dvrpc-blue-1 text-white justify-center gap-4 transition-all duration-300 ease-out ${
        !isVisible ? "max-h-0" : "max-h-8"
      }`}
    >
      {isVisible &&
        subcategories.map((subcategory) => (
          <SubcategoryDropdown
            key={subcategory.id}
            subcategory={subcategory.label}
            topics={subcategory.topics}
            isActive={subcategory.id === activeSubcategoryId}
            navOpen={isVisible}
          />
        ))}
    </div>
  );
}
