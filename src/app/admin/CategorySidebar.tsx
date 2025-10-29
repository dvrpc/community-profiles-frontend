import { CategoryKeyMap, GeoLevel } from "@/types";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { Mode } from "./Dashboard";

interface Props {
  tree?: CategoryKeyMap;
  handleClick: (category: string, subcategory: string, topic: string) => void;
  mode: Mode;
  handleModeChange: (mode: Mode) => void;
  geoLevel: GeoLevel;
  setGeoLevel: (geoLevel: GeoLevel) => void;
}

export default function CategorySidebar(props: Props) {
  const { tree, handleClick, mode, handleModeChange, geoLevel, setGeoLevel } =
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
    topic: string
  ) => {
    setSelected({ category, subcategory, topic });
    handleClick(category, subcategory, topic);
  };

  if (!tree) return <></>;

  return (
    <div className="w-64 h-full bg-dvrpc-gray-7 overflow-y-auto p-4 space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => handleModeChange("content")}
          className={`flex-1 px-3 py-2 rounded font-semibold transition ${
            mode === "content"
              ? "bg-dvrpc-blue-1 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Content
        </button>

        <button
          onClick={() => handleModeChange("viz")}
          className={`flex-1 px-3 py-2 rounded font-semibold transition ${
            mode === "viz"
              ? "bg-dvrpc-blue-1 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Viz
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
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
              className="flex items-center justify-between w-full text-left px-2 py-2 font-bold text-gray-700 rounded hover:bg-gray-200"
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
                              selected?.topic === item;

                            return (
                              <li
                                key={item}
                                onClick={() =>
                                  handleItemClick(category, subcat, item)
                                }
                                className={`px-2 py-1 rounded cursor-pointer transition ${
                                  isSelected
                                    ? "bg-dvrpc-blue-1 text-white"
                                    : "hover:bg-gray-300"
                                }`}
                              >
                                {item}
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
