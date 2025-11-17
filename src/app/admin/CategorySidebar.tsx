import { CategoryKeyMap, GeoLevel } from "@/types/types";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { Mode } from "./Dashboard";

interface Props {
  tree?: CategoryKeyMap;
  handleClick: (id: number) => void;

  geoLevel: GeoLevel;
  setGeoLevel: (geoLevel: GeoLevel) => void;
}

export default function CategorySidebar(props: Props) {
  const { tree, handleClick, geoLevel, setGeoLevel } =
    props;
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<{
    category: string;
    subcategory: string;
    topic: string;
  } | null>(null);

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleItemClick = (
    category: string,
    subcategory: string,
    topic: string,
    id: number
  ) => {
    setSelected({ category, subcategory, topic });
    handleClick(id);
  };

  if (!tree) return <></>;

  return (
    <div className="">
      <div>
        <label className="block text-sm font-semiboldmb-1 p-2">
          Geography Level
        </label>
        <select
          value={geoLevel}
          onChange={(e) => setGeoLevel(e.target.value as GeoLevel)}
          className="w-full px-2 py-2 rounded bg-white border border-gray-300 text-gray-800 cursor-pointer"
        >
          <option value="region">Region</option>
          <option value="county">County</option>
          <option value="municipality">Municipality</option>
        </select>
      </div>
      {Object.entries(tree).map(([category, subcats]) => {
        const categoryKey = `cat-${category}`;
        const isCategoryOpen = !!openSections[categoryKey];

        return (
          <div key={category} className="mb-4">
            <button
              onClick={() => toggleSection(categoryKey)}
              className="flex items-center justify-between w-full text-left px-2 py-2 font-boldrounded hover:bg-gray-200"
            >
              <span>{category}</span>
              {isCategoryOpen ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>

            {isCategoryOpen && (
              <div className="ml-4 mt-2">
                {Object.entries(subcats).map(([subcat, items]) => {
                  const subcatKey = `${categoryKey}-${subcat}`;
                  const isSubcatOpen = !!openSections[subcatKey];

                  return (
                    <div key={subcat} className="mb-1">
                      <button
                        onClick={() => toggleSection(subcatKey)}
                        className="flex items-center justify-between w-full text-left px-2 py-1 rounded hover:bg-gray-200"
                      >
                        <span>{subcat}</span>
                        {isSubcatOpen ? (
                          <ChevronDownIcon className="w-4 h-4" />
                        ) : (
                          <ChevronRightIcon className="w-4 h-4" />
                        )}
                      </button>

                      {isSubcatOpen && (
                        <ul className="ml-4 mt-1">
                          {items.map((item) => {
                            const isSelected =
                              selected?.category === category &&
                              selected?.subcategory === subcat &&
                              selected?.topic === item.name;

                            return (
                              <li
                                key={item.id}
                                onClick={() =>
                                  handleItemClick(
                                    category,
                                    subcat,
                                    item.name,
                                    item.id
                                  )
                                }
                                className={`px-2 py-1 rounded cursor-pointer transition ${isSelected
                                  ? "bg-dvrpc-blue-1 text-white"
                                  : "hover:bg-gray-300"
                                  }`}
                              >
                                {item.name}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
