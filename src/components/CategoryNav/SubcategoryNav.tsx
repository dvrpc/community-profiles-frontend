import { SubcategoryKeyMap } from "@/types";
import SubcategoryButton from "./SubcategoryTooltip";

interface Props {
  subcategoryKeyMap: SubcategoryKeyMap;
  isVisible: boolean;
  activeSubcategory: string;
}

export default function SubcategoryTooltip(props: Props) {
  const { subcategoryKeyMap, isVisible, activeSubcategory } = props;

  return (
    <div
      className={`flex bg-dvrpc-blue-1 text-white justify-center gap-4 transition-all duration-300 ease-in-out ${
        !isVisible ? "max-h-0" : "max-h-8"
      }`}
    >
      {Object.entries(subcategoryKeyMap).map(([key, topics], index) => (
        <SubcategoryButton
          key={`${key}-${index}`}
          subcategory={key}
          topics={topics}
          isActive={key == activeSubcategory}
        />
      ))}
    </div>
  );
}
