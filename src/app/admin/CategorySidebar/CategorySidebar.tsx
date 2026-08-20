import { GeoLevel } from "@/types/types";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { TreeLevel } from "../Dashboard";
import CreateModal from "./CreateModal";
import DeleteModal from "./DeleteModal";
import { useAdminToast } from "../Toast/AdminToast";
import {
  useTree,
  useCreateSubcategory,
  useCreateTopic,
  useDeleteTopic,
  useDeleteSubcategory,
} from "@/lib/hooks";

interface Props {
  handleClick: (id: number, newTreeLevel: TreeLevel) => void;
  geoLevel: GeoLevel;
  setGeoLevel: (geoLevel: GeoLevel) => void;
}

export default function CategorySidebar(props: Props) {
  const { handleClick, geoLevel, setGeoLevel } = props;

  const { data: tree } = useTree(geoLevel);
  const { showToast, showError } = useAdminToast();

  const subcategoryCreateMutation = useCreateSubcategory();
  const topicCreateMutation = useCreateTopic();
  const topicDeleteMutation = useDeleteTopic();
  const subcategoryDeleteMutation = useDeleteSubcategory();
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<{
    category_id: number | null;
    subcategory_id: number | null;
    topic_id: number | null;
  } | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    type: "subcategory" | "topic";
    id: number;
    name: string;
  } | null>(null);

  const [createModal, setCreateModal] = useState<
    | { type: "subcategory"; parentId: number; parentLabel: string }
    | { type: "topic"; parentId: number; parentLabel: string }
    | null
  >(null);

  const toggleSection = (section_id: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [section_id]: !prev[section_id],
    }));
  };

  const handleTopicClick = (
    category_id: number,
    subcategory_id: number,
    topic_id: number,
  ) => {
    setSelected({ category_id, subcategory_id, topic_id });
    handleClick(topic_id, "topic");
  };

  const handleSubcategoryClick = (
    category_id: number,
    subcategory_id: number,
  ) => {
    setSelected({ category_id, subcategory_id, topic_id: null });
    handleClick(subcategory_id, "subcategory");
  };

  const openCreateModal = (
    type: "subcategory" | "topic",
    parentId: number,
    parentLabel: string,
  ) => {
    setCreateModal({
      type,
      parentId,
      parentLabel,
    });
  };

  const closeCreateModal = () => {
    setCreateModal(null);
  };

  const handleCreate = (label: string, urlId: string, sortWeight: number) => {
    if (!createModal) return;
    if (createModal.type === "topic") {
      topicCreateMutation.mutate(
        {
          subcategory_id: createModal.parentId,
          label,
          url_id: urlId,
          sort_weight: sortWeight,
        },
        {
          onSuccess: (id) =>
            showToast(`Topic "${label}" created successfully (ID: ${id}).`),
          onError: (error) =>
            showError(error, `Failed to create topic "${label}"`),
        },
      );
    } else {
      subcategoryCreateMutation.mutate(
        {
          category_id: createModal.parentId,
          label,
          url_id: urlId,
          geo_level: geoLevel,
          sort_weight: sortWeight,
        },
        {
          onSuccess: (id) =>
            showToast(
              `Subcategory "${label}" created successfully (ID: ${id}).`,
            ),
          onError: (error) =>
            showError(error, `Failed to create subcategory "${label}"`),
        },
      );
    }
    closeCreateModal();
  };

  const openDeleteModal = (
    type: "subcategory" | "topic",
    id: number,
    name: string,
  ) => {
    setPendingDelete({ type, id, name });
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setPendingDelete(null);
  };

  const confirmDeletion = () => {
    if (!pendingDelete) return;
    if (pendingDelete.type === "subcategory")
      subcategoryDeleteMutation.mutate(pendingDelete.id);
    if (pendingDelete.type === "topic")
      topicDeleteMutation.mutate(pendingDelete.id);
    setDeleteModalOpen(false);
    setPendingDelete(null);
  };

  const handleGeoLevelChange = (geoLevel: GeoLevel) => {
    setGeoLevel(geoLevel);
  };

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

      {tree.map((category) => {
        const subcategories = category.subcategories ?? [];
        const isCategoryOpen = !!openSections[category.id];

        return (
          <div key={category.id} className="my-4">
            <div
              className={`flex items-center justify-between w-full font-bold rounded`}
            >
              <button
                className={`flex items-center justify-between w-full text-left p-2 rounded cursor-pointer
                          ${
                            selected?.category_id === category.id &&
                            selected?.subcategory_id === null &&
                            selected?.topic_id === null
                              ? "bg-dvrpc-blue-1 text-white"
                              : "hover:bg-gray-300"
                          }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected({
                    category_id: category.id,
                    subcategory_id: null,
                    topic_id: null,
                  });
                  handleClick(category.id, "category");
                }}
              >
                <span>{category.label}</span>
              </button>

              <button
                className="p-2 ml-1 rounded-sm cursor-pointer hover:bg-gray-200"
                onClick={() => toggleSection(category.id)}
              >
                {isCategoryOpen ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* SUBCATEGORIES */}
            {isCategoryOpen && (
              <div className="ml-4 mt-2">
                {subcategories.map((subcategory) => {
                  const isSubcatOpen = !!openSections[subcategory.id];

                  return (
                    <div key={subcategory.id} className="mb-2">
                      <div className="flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubcategoryClick(category.id, subcategory.id);
                          }}
                          className={`flex items-center justify-between w-full text-left px-2 py-1 rounded cursor-pointer
                          ${
                            selected?.category_id === category.id &&
                            selected?.subcategory_id === subcategory.id &&
                            selected?.topic_id === null
                              ? "bg-dvrpc-blue-1 text-white"
                              : "hover:bg-gray-200"
                          }`}
                        >
                          <span>{subcategory.label}</span>
                        </button>

                        <button
                          onClick={() => toggleSection(subcategory.id)}
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
                            openDeleteModal(
                              "subcategory",
                              subcategory.id,
                              subcategory.label,
                            )
                          }
                          className="p-2 rounded-sm hover:bg-gray-200"
                        >
                          <Trash2 size={16} color="red" />
                        </button>
                      </div>

                      {isSubcatOpen && (
                        <ul className="ml-4 mt-1">
                          {(subcategory.topics ?? []).map((topic) => (
                            <li
                              key={topic.id}
                              className="flex justify-between items-center"
                            >
                              <div
                                className={`${!topic.is_visible && "text-dvrpc-gray-4"} px-2 py-1 rounded cursor-pointer flex-1 ${
                                  selected?.category_id === category.id &&
                                  selected?.subcategory_id === subcategory.id &&
                                  selected?.topic_id === topic.id
                                    ? "bg-dvrpc-blue-1 text-white"
                                    : "hover:bg-gray-300"
                                }`}
                                onClick={() =>
                                  handleTopicClick(
                                    category.id,
                                    subcategory.id,
                                    topic.id,
                                  )
                                }
                              >
                                {topic.label} {!topic.is_visible && "(hidden)"}
                              </div>

                              <button
                                onClick={() =>
                                  openDeleteModal(
                                    "topic",
                                    topic.id,
                                    topic.label,
                                  )
                                }
                                disabled={
                                  (subcategory.topics ?? []).length === 1
                                }
                                className="p-2 rounded-sm hover:bg-gray-200 cursor-pointer"
                              >
                                <Trash2
                                  size={16}
                                  color={
                                    (subcategory.topics ?? []).length !== 1
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
                                openCreateModal(
                                  "topic",
                                  subcategory.id,
                                  subcategory.label,
                                )
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
                    openCreateModal("subcategory", category.id, category.label)
                  }
                  className="text-sm text-dvrpc-blue-3 hover:underline mt-3 ml-4 cursor-pointer"
                >
                  + Add Subcategory
                </button>
              </div>
            )}
          </div>
        );
      })}

      {pendingDelete && deleteModalOpen && (
        <DeleteModal
          type={pendingDelete.type}
          name={pendingDelete.name}
          onConfirm={confirmDeletion}
          onCancel={handleCloseDeleteModal}
        />
      )}

      {createModal && (
        <CreateModal
          type={createModal.type}
          parentLabel={createModal.parentLabel}
          onSave={handleCreate}
          onCancel={closeCreateModal}
        />
      )}
    </div>
  );
}
