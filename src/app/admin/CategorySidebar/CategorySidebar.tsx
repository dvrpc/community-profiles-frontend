import { GeoLevel } from "@/types/types";
import { ChevronDownIcon, ChevronRightIcon, Trash2 } from "lucide-react";
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
import GeographySelect from "../Components/GeographySelect";

interface Props {
  handleClick: (id: number, newTreeLevel: TreeLevel) => void;
  geoLevel: GeoLevel;
  setGeoLevel: (geoLevel: GeoLevel) => void;
  geoid: string | undefined;
  setGeoid: (geoid: string) => void;
  selectedId: number;
  selectedTreeLevel: TreeLevel;
}

export default function CategorySidebar(props: Props) {
  const {
    handleClick,
    geoLevel,
    setGeoLevel,
    geoid,
    setGeoid,
    selectedId,
    selectedTreeLevel,
  } = props;

  const { data: tree } = useTree(geoLevel);
  const { showToast, showError } = useAdminToast();

  const subcategoryCreateMutation = useCreateSubcategory();
  const topicCreateMutation = useCreateTopic();
  const topicDeleteMutation = useDeleteTopic();
  const subcategoryDeleteMutation = useDeleteSubcategory();
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
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

  const handleTopicClick = (topicId: number) => {
    handleClick(topicId, "topic");
  };

  const handleSubcategoryClick = (subcategoryId: number) => {
    handleClick(subcategoryId, "subcategory");
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
    const { id, name, type } = pendingDelete;
    const onSuccess = () =>
      showToast(`${type} "${name}" deleted successfully.`);
    const onError = (error: unknown) =>
      showError(error, `Failed to delete ${type} "${name}"`);

    if (type === "subcategory") {
      subcategoryDeleteMutation.mutate(id, { onSuccess, onError });
    }
    if (type === "topic") {
      topicDeleteMutation.mutate(id, { onSuccess, onError });
    }
    setDeleteModalOpen(false);
    setPendingDelete(null);
  };

  const handleGeoLevelChange = (geoLevel: GeoLevel) => {
    setGeoLevel(geoLevel);
  };

  if (!tree) return <></>;

  return (
    <div>
      <div className="mb-3 rounded-lg border border-dvrpc-gray-7 p-3">
        <label className="mb-1 block  font-semibold  tracking-wide text-dvrpc-blue-1">
          Geography level
        </label>
        <select
          value={geoLevel}
          onChange={(e) => handleGeoLevelChange(e.target.value as GeoLevel)}
          className="w-full cursor-pointer rounded-md border border-dvrpc-gray-5 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-dvrpc-blue-3 focus:ring-2 focus:ring-dvrpc-blue-3/20"
        >
          <option value="region">Region</option>
          <option value="county">County</option>
          <option value="municipality">Municipality</option>
        </select>
        <GeographySelect
          geoLevel={geoLevel}
          geoid={geoid}
          setGeoid={setGeoid}
        />
      </div>

      <div className="space-y-3">
        {tree.map((category) => {
          const subcategories = category.subcategories ?? [];
          const isCategoryOpen = !!openSections[category.id];

          return (
            <div
              key={category.id}
              className="overflow-hidden rounded-lg border border-dvrpc-gray-7 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between w-full ">
                <button
                  type="button"
                  className={`flex min-w-0 items-center gap-2 w-full text-left px-3 py-2.5 font-semibold rounded-l-md cursor-pointer transition-colors
                          ${
                            selectedTreeLevel === "category" &&
                            selectedId === category.id
                              ? "bg-dvrpc-blue-1 text-white"
                              : "text-dvrpc-blue-1 hover:bg-dvrpc-blue-1/10"
                          }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(category.id, "category");
                  }}
                >
                  <span className="break-words whitespace-normal">
                    {category.label}
                  </span>
                </button>

                <button
                  type="button"
                  aria-label={`${isCategoryOpen ? "Collapse" : "Expand"} ${category.label}`}
                  aria-expanded={isCategoryOpen}
                  className="p-2.5 mr-1 rounded-md cursor-pointer text-dvrpc-blue-1 hover:bg-dvrpc-blue-1/10"
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
                <div className="mx-3 my-3 space-y-2 border-l-2 border-dvrpc-blue-1/20 pl-3">
                  {subcategories.map((subcategory) => {
                    const isSubcatOpen = !!openSections[subcategory.id];

                    return (
                      <div key={subcategory.id} className="relative">
                        <div className="flex items-center rounded-md bg-gray-50 ring-1 ring-inset ring-gray-200">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubcategoryClick(subcategory.id);
                            }}
                            className={`flex min-w-0 items-center w-full text-left px-3 py-2 text-sm font-medium rounded-l-md cursor-pointer transition-colors
                          ${
                            selectedTreeLevel === "subcategory" &&
                            selectedId === subcategory.id
                              ? "bg-dvrpc-blue-1 text-white"
                              : "text-gray-800 hover:bg-dvrpc-blue-1/10"
                          }`}
                          >
                            <span className="break-words whitespace-normal">
                              {subcategory.label}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleSection(subcategory.id)}
                            aria-label={`${isSubcatOpen ? "Collapse" : "Expand"} ${subcategory.label}`}
                            aria-expanded={isSubcatOpen}
                            className="cursor-pointer p-2 rounded-sm text-gray-600 hover:bg-gray-200"
                          >
                            {isSubcatOpen ? (
                              <ChevronDownIcon className="w-4 h-4" />
                            ) : (
                              <ChevronRightIcon className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(
                                "subcategory",
                                subcategory.id,
                                subcategory.label,
                              )
                            }
                            aria-label={`Delete ${subcategory.label}`}
                            className="p-2 rounded-sm hover:bg-red-50"
                          >
                            <Trash2 size={16} color="red" />
                          </button>
                        </div>

                        {isSubcatOpen && (
                          <ul className="ml-3 mt-2 space-y-1 border-l border-dvrpc-blue-1/20 pl-3">
                            {(subcategory.topics ?? []).map((topic) => (
                              <li
                                key={topic.id}
                                className="flex items-center rounded-md"
                              >
                                <button
                                  type="button"
                                  className={`${!topic.is_visible && "text-dvrpc-gray-4"} flex-1 min-w-0 border-l-2 border-transparent px-3 py-1.5 text-left text-sm rounded cursor-pointer transition-colors ${
                                    selectedTreeLevel === "topic" &&
                                    selectedId === topic.id
                                      ? "border-dvrpc-blue-1 bg-dvrpc-blue-1/10 font-medium text-dvrpc-blue-1"
                                      : "hover:border-dvrpc-blue-1/40 hover:bg-gray-100"
                                  }`}
                                  onClick={() => handleTopicClick(topic.id)}
                                >
                                  <span className="break-words whitespace-normal">
                                    {topic.label}
                                  </span>{" "}
                                  {!topic.is_visible && (
                                    <span className="ml-1 text-xs">
                                      (hidden)
                                    </span>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    openDeleteModal(
                                      "topic",
                                      topic.id,
                                      topic.label,
                                    )
                                  }
                                  aria-label={`Delete ${topic.label}`}
                                  className="p-2 rounded-sm hover:bg-red-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <Trash2 size={16} color="red" />
                                </button>
                              </li>
                            ))}

                            <li className="mt-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openCreateModal(
                                    "topic",
                                    subcategory.id,
                                    subcategory.label,
                                  )
                                }
                                className="text-xs font-medium text-dvrpc-blue-3 hover:underline cursor-pointer"
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
                    type="button"
                    onClick={() =>
                      openCreateModal(
                        "subcategory",
                        category.id,
                        category.label,
                      )
                    }
                    className="ml-3 text-xs font-medium text-dvrpc-blue-3 hover:underline cursor-pointer"
                  >
                    + Add Subcategory
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

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
