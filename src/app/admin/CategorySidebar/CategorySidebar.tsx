import {
  CategoryKeyMap,
  CategoryKeys,
  GeoLevel,
  getTypedObjectEntries,
} from "@/types/types";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import DeleteModal from "./DeleteModal";
import { TreeLevel } from "../Dashboard";

interface Props {
  tree?: CategoryKeyMap;
  handleClick: (id: number, newTreeLevel: TreeLevel) => void;
  geoLevel: GeoLevel;
  setGeoLevel: (geoLevel: GeoLevel) => void;
  addSubcategory: (category_id: number, newSubcat: string) => void;
  addTopic: (subcatId: number, newTopic: string) => void;
  updateSubcategory: (subcatId: number, newSubcat: string) => void;
  updateTopic: (topicId: number, newTopic: string) => void;
  deleteTopic: (topicId: number) => void;
  deleteSubcategory: (subcatId: number) => void;
}

export default function CategorySidebar(props: Props) {
  const {
    tree,
    handleClick,
    geoLevel,
    setGeoLevel,
    addSubcategory,
    addTopic,
    updateSubcategory,
    updateTopic,
    deleteTopic,
    deleteSubcategory,
  } = props;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<{
    category: CategoryKeys;
    subcategory: string;
    topic: string;
  } | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    type: "subcategory" | "topic";
    id: number;
    name: string;
  } | null>(null);

  const [pendingGeoLevelChange, setPendingGeoLevelChange] = useState(false);

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleItemClick = (
    category: CategoryKeys,
    subcategory: string,
    topic: string,
    id: number
  ) => {
    setSelected({ category, subcategory, topic });
    handleClick(id, 'topic');
  };

  // NEW: Select subcategory
  const handleSubcategoryClick = (
    category: CategoryKeys,
    subcatId: number,
    subcategory: string,
  ) => {
    setSelected({ category, subcategory, topic: "" });
    handleClick(subcatId, 'subcategory')
  };

  const handleAddTopic = (subcatId: number, subcatName: string) => {
    const newTopic = prompt(`New topic for "${subcatName}":`);
    if (newTopic?.trim()) addTopic(subcatId, newTopic.trim());
  };

  const handleAddSubcategory = (category_id: number, category: string) => {
    const newSubcat = prompt(`New subcategory under "${category}":`);
    if (newSubcat?.trim()) addSubcategory(category_id, newSubcat.trim());
  };

  const handleEditTopic = (topicName: string, topicId: number) => {
    const newName = prompt(`Edit topic "${topicName}":`, topicName);
    if (newName?.trim()) updateTopic(topicId, newName.trim());
  };

  const handleEditSubcategory = (subcatId: number, subcatName: string) => {
    const newName = prompt(`Edit subcategory "${subcatName}":`, subcatName);
    if (newName?.trim()) updateSubcategory(subcatId, newName.trim());
  };

  const handleDeleteSubcategory = (subcatId: number, name: string) => {
    setPendingDelete({ type: "subcategory", id: subcatId, name });
    setDeleteModalOpen(true);
  };

  const handleDeleteTopic = (topicId: number, name: string) => {
    setPendingDelete({ type: "topic", id: topicId, name });
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setPendingDelete(null);
  };

  const confirmDeletion = () => {
    if (!pendingDelete) return;
    if (pendingDelete.type === "subcategory")
      deleteSubcategory(pendingDelete.id);
    if (pendingDelete.type === "topic") deleteTopic(pendingDelete.id);
    setDeleteModalOpen(false);
    setPendingDelete(null);
  };

  const handleGeoLevelChange = (geoLevel: GeoLevel) => {
    setGeoLevel(geoLevel);
    setPendingGeoLevelChange(true);
  };

  useEffect(() => {
    function selectOnGeoLevelChange() {
      if (pendingGeoLevelChange && selected && tree) {
        if (selected.topic === "") {
          const content_id = tree[selected.category].content_id;
          handleClick(content_id, 'topic');
        } else {
          const subcategory = tree[selected.category].subcategories.find(
            (s) => s.name === selected.subcategory
          );
          if (!subcategory) return;
          const topic = subcategory.topics.find(
            (t) => t.name === selected.topic
          );
          if (!topic) return;
          handleClick(topic.content_id, 'category');
        }
        setPendingGeoLevelChange(false);
      }
    }

    selectOnGeoLevelChange();
  }, [tree]);

  if (!tree) return <></>;

  return (
    <div>
      <div className="pb-2">
        <label className="block text-sm font-semibold mb-1 p-2">
          Geography Level
        </label>
        <select
          value={geoLevel}
          onChange={(e) => handleGeoLevelChange(e.target.value as GeoLevel)}
          className="w-full px-2 py-2 rounded bg-white border border-gray-300 text-gray-800 cursor-pointer"
        >
          <option value="region">Region</option>
          <option value="county">County</option>
          <option value="municipality">Municipality</option>
        </select>
      </div>

      {getTypedObjectEntries(tree).map(([category, categoryTree]) => {
        const subcats = categoryTree.subcategories;
        const categoryKey = `cat-${category}`;
        const isCategoryOpen = !!openSections[categoryKey];

        return (
          <div key={category} className="my-4">
            <div
              className={`flex items-center justify-between w-full font-bold rounded`}>
              <button className={`flex items-center justify-between w-full text-left p-2 rounded cursor-pointer
                          ${selected?.category === category &&
                  selected?.subcategory === "" &&
                  selected?.topic === ""
                  ? "bg-dvrpc-blue-1 text-white"
                  : "hover:bg-gray-300"
                }`} onClick={(e) => {
                  e.stopPropagation();
                  setSelected({ category, subcategory: "", topic: "" });
                  handleClick(categoryTree.content_id, 'category');
                }}>
                <span

                >
                  {category}
                </span>
              </button>


              <button className="p-2 ml-1 rounded-sm cursor-pointer hover:bg-gray-200" onClick={() => toggleSection(categoryKey)}>
                {isCategoryOpen ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* SUBCATEGORIES */}
            {
              isCategoryOpen && (
                <div className="ml-4 mt-2">
                  {subcats.map((subcat) => {
                    const subcatKey = `${categoryKey}-${subcat.id}`;
                    const isSubcatOpen = !!openSections[subcatKey];

                    return (
                      <div key={subcat.id} className="mb-2">
                        <div className="flex items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubcategoryClick(
                                category,
                                subcat.id,
                                subcat.name
                              );
                            }}
                            className={`flex items-center justify-between w-full text-left px-2 py-1 rounded cursor-pointer
                          ${selected?.category === category &&
                                selected?.subcategory === subcat.name &&
                                selected?.topic === ""
                                ? "bg-dvrpc-blue-1 text-white"
                                : "hover:bg-gray-200"
                              }`}
                          >
                            <span>{subcat.name}</span>
                          </button>

                          <button
                            onClick={() => toggleSection(subcatKey)}
                            className="cursor-pointer p-2 ml-1 rounded-sm hover:bg-gray-200"
                          >
                            {isSubcatOpen ? (
                              <ChevronDownIcon className="w-4 h-4" />
                            ) : (
                              <ChevronRightIcon className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() =>
                              handleEditSubcategory(subcat.id, subcat.name)
                            }
                            className="p-2 rounded-sm hover:bg-gray-200 "
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteSubcategory(subcat.id, subcat.name)
                            }
                            className="p-2 rounded-sm hover:bg-gray-200"
                          >
                            <Trash2 size={16} color="red" />
                          </button>
                        </div>

                        {isSubcatOpen && (
                          <ul className="ml-4 mt-1">
                            {subcat.topics.map((topic) => (
                              <li
                                key={topic.id}
                                className="flex justify-between items-center"
                              >
                                <div
                                  className={`px-2 py-1 rounded cursor-pointer flex-1 ${selected?.category === category &&
                                    selected?.subcategory === subcat.name &&
                                    selected?.topic === topic.name
                                    ? "bg-dvrpc-blue-1 text-white"
                                    : "hover:bg-gray-300"
                                    }`}
                                  onClick={() =>
                                    handleItemClick(
                                      category,
                                      subcat.name,
                                      topic.name,
                                      topic.content_id
                                    )
                                  }
                                >
                                  {topic.name}
                                </div>
                                <button
                                  onClick={() =>
                                    handleEditTopic(topic.name, topic.id)
                                  }
                                  className="p-2 rounded-sm hover:bg-gray-200 cursor-pointer"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteTopic(topic.id, topic.name)
                                  }
                                  disabled={subcat.topics.length === 1}
                                  className="p-2 rounded-sm hover:bg-gray-200 cursor-pointer"
                                >
                                  <Trash2
                                    size={16}
                                    color={
                                      subcat.topics.length !== 1
                                        ? "red"
                                        : "black"
                                    }
                                  />
                                </button>
                              </li>
                            ))}

                            <li className="mt-2">
                              <button
                                onClick={() =>
                                  handleAddTopic(subcat.id, subcat.name)
                                }
                                className="text-sm text-dvrpc-blue-3 hover:underline cursor-pointer"
                              >
                                + Add Topic
                              </button>
                            </li>
                          </ul>
                        )}
                      </div>
                    );
                  })}

                  <button
                    onClick={() =>
                      handleAddSubcategory(categoryTree.id, category)
                    }
                    className="text-sm text-dvrpc-blue-3 hover:underline mt-3 ml-4 cursor-pointer"
                  >
                    + Add Subcategory
                  </button>
                </div>
              )
            }
          </div>
        );
      })}

      <DeleteModal
        open={deleteModalOpen}
        type={pendingDelete?.type}
        name={pendingDelete?.name}
        onConfirm={confirmDeletion}
        onCancel={handleCloseDeleteModal}
      />
    </div >
  );
}
