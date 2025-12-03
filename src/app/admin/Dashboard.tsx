"use client";

import { useEffect, useState } from "react";
import {
  useTree,
  useProfile,
  useHistory,
  usePreview,
  useSave,
  useContent,
  useViz,
  useUpdateSubcategory,
  useUpdateTopic,
  useCreateSubcategory,
  useCreateTopic,
  useDeleteTopic,
  useDeleteSubcategory,
  useUpdateProperties,
} from "../../lib/hooks";
import CategorySidebar from "./CategorySidebar/CategorySidebar";
import MarkdownEditor from "./Content/MarkdownEditor";
import MarkdownPreview from "./Content/MarkdownPreview";
import VizEditor from "./Viz/VizEditor";
import VizPreview from "./Viz/VizPreview";
import VersionControl from "./VersionControl";
import UnsavedChangesModal from "./UnsavedChangesModal";
import Button from "@/components/Buttons/Button";
import { GeoLevel, PropertyForm, Visualization } from "@/types/types";
import Header from "./Header";
import SourceEditor from "./Source/SourceEditor";
import PropertiesForm from "./PropertiesForm";

const defaultGeoid = {
  region: "",
  county: "42101",
  municipality: "4201704976",
};

export type Mode = "content" | "viz" | "properties" | "sources";

export default function Dashboard() {
  const [selectedGeoLevel, setSelectedGeoLevel] = useState<GeoLevel>("county");
  const [selectedMode, setSelectedMode] = useState<Mode>("content");
  const [selectedId, setSelectedId] = useState<number>(0);
  const [categorySelected, setCategorySelected] = useState<boolean>(false);

  const [editText, setEditText] = useState("");
  const [hasEdits, setHasEdits] = useState(false);

  const [pendingId, setPendingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const geoid = defaultGeoid[selectedGeoLevel];

  const { data: tree } = useTree(selectedGeoLevel);
  const { data: profile } = useProfile(selectedGeoLevel, geoid);

  const { data: content } = useContent(selectedId);
  const { data: viz } = useViz(selectedId);

  const { data: history } = useHistory(selectedMode, selectedId);

  const { data: preview } = usePreview(
    editText,
    selectedMode,
    selectedGeoLevel,
    geoid
  );

  const saveMutation = useSave();
  const subcategoryUpdateMutation = useUpdateSubcategory();
  const topicUpdateMutation = useUpdateTopic();
  const subcategoryCreateMutation = useCreateSubcategory();
  const topicCreateMutation = useCreateTopic();
  const topicDeleteMutation = useDeleteTopic();
  const subcategoryDeleteMutation = useDeleteSubcategory();
  const propetiesMutation = useUpdateProperties();

  useEffect(() => {
    if (selectedMode == "content" && content) setEditText(content["file"]);
    if (selectedMode == "viz" && viz) setEditText(JSON.parse(viz["file"]));
  }, [content, viz, selectedMode]);

  function handleCategorySidebarSelect(id: number, isCategory = false) {
    if (hasEdits) {
      setPendingId(id);
      setModalOpen(true);
      return;
    }

    if (!categorySelected && isCategory) {
      setCategorySelected(true);
      if (selectedMode == "properties" || selectedMode == "viz") {
        setSelectedMode("content");
      }
    }

    if (categorySelected && !isCategory) {
      setCategorySelected(false);
    }

    setSelectedId(id);
  }

  function handleContinue(save: boolean) {
    if (save) {
      handleSaveClick();
    }

    if (!pendingId) {
      throw new Error("No pending topic id...");
    }

    setSelectedId(pendingId);
    setModalOpen(false);
    setHasEdits(false);
    setPendingId(null);
  }

  function handleSaveClick() {
    const body =
      selectedMode === "content" ? editText : JSON.stringify(editText);
    const url = `/${selectedMode}/${selectedId}`;
    saveMutation.mutate({ url, body });
    setHasEdits(false);
  }

  function handleContentEdit(value: string) {
    setEditText(value);

    if (!hasEdits) {
      setHasEdits(true);
    }
  }

  function handleVizEdit(value: string) {
    setEditText(value);

    if (!hasEdits) {
      setHasEdits(true);
    }
  }

  function handleModeChange(mode: Mode) {
    setEditText("");
    setSelectedMode(mode);
  }

  function handleVersionChange(file: string, index: number) {
    if (selectedMode == "content") {
      setEditText(file);
    } else {
      setEditText(JSON.parse(file));
    }
    setHasEdits(index > 0);
  }

  function handlePropertiesSave(
    id: number,
    topicId: number,
    payload: Partial<PropertyForm>
  ) {
    if (payload.label || payload.sort_weight) {
      topicUpdateMutation.mutate({
        topicId,
        topic: {
          label: payload.label,
          sort_weight: payload.sort_weight,
        },
      });
      delete payload.label;
      delete payload.sort_weight;
    }
    propetiesMutation.mutate({ id, payload });
  }

  function getPreview() {
    if (!preview) return <></>;
    if (selectedMode == "content")
      return <MarkdownPreview content={preview as string} />;
    if (profile)
      return (
        <VizPreview
          visualizations={preview as Visualization[]}
          buffer_bbox={profile.buffer_bbox}
          geoLevel={selectedGeoLevel}
          geoid={profile.geoid}
        />
      );
  }

  function addSubcategory(categoryId: number, newSubcat: string) {
    subcategoryCreateMutation.mutate({ categoryId, newSubcat });
  }

  function addTopic(subcatId: number, newTopic: string) {
    topicCreateMutation.mutate({ subcatId, newTopic });
  }

  function updateSubcategory(subcatId: number, newSubcat: string) {
    subcategoryUpdateMutation.mutate({ subcatId, newSubcat });
  }

  function updateTopic(topicId: number, newTopic: string) {
    topicUpdateMutation.mutate({
      topicId,
      topic: {
        name: newTopic,
      },
    });
  }

  function deleteTopic(topicId: number) {
    topicDeleteMutation.mutate(topicId);
  }

  function deleteSubcategory(subcatId: number) {
    subcategoryDeleteMutation.mutate(subcatId);
  }

  return (
    <div className="h-screen grid grid-cols-[250px_1fr_1fr_250px] grid-rows-[80px_1fr_200px] x gap-2 p-2">
      <div className="col-span-3 col-start-2 p-2 bg-white flex justify-between rounded-md">
        <Header
          currentTab={selectedMode}
          setCurrentTab={handleModeChange}
          categorySelected={categorySelected}
        />
      </div>
      <div className="p-2 col-start-1 row-start-1">
        <h1 className="text-2xl text-dvrpc-blue-1">Community Profiles</h1>
        <span className="">Admin Dasbhoard</span>
      </div>
      <div className="row-span-3 p-2 overflow-auto">
        <CategorySidebar
          tree={tree}
          handleClick={handleCategorySidebarSelect}
          geoLevel={selectedGeoLevel}
          setGeoLevel={setSelectedGeoLevel}
          addSubcategory={addSubcategory}
          addTopic={addTopic}
          updateSubcategory={updateSubcategory}
          updateTopic={updateTopic}
          deleteTopic={deleteTopic}
          deleteSubcategory={deleteSubcategory}
        />
      </div>
      {(selectedMode == "content" || selectedMode == "viz") && (
        <>
          <div
            className={`col-start-2 row-start-2 row-span-2 bg-white p-2 rounded-md overflow-auto`}
          >
            <h3 className="text-xl p-2 mb-2">Editor</h3>

            {selectedMode === "content" ? (
              <MarkdownEditor
                value={editText}
                handleChange={handleContentEdit}
              />
            ) : (
              <VizEditor
                visualizations={editText}
                handleChange={handleVizEdit}
              />
            )}
          </div>
          <div
            className={`col-start-3 row-start-2 row-span-2 bg-white p-2 rounded-md overflow-auto`}
          >
            <div className="flex justify-between p-2 mb-2">
              <h3 className="text-xl">Preview</h3>
              <Button
                disabled={!hasEdits}
                handleClick={handleSaveClick}
                type={"primary"}
              >
                Save Changes
              </Button>
            </div>

            {getPreview()}
          </div>
          <div className="row-span-2 col-start-4 row-start-2 bg-white rounded-md">
            <VersionControl
              contentHistory={history || []}
              handleClick={handleVersionChange}
            />
          </div>
        </>
      )}
      {selectedMode == "sources" && (
        <div className="col-start-2 row-span-3 col-span-3 bg-white p-2 rounded-md">
          <SourceEditor />
        </div>
      )}
      {selectedMode == "properties" && content && viz && (
        <div className="col-span-3 col-start-2 row-span-2 row-start-2 bg-white p-2 rounded-md">
          <PropertiesForm
            id={content.id}
            topic_id={content.topic_id}
            initialData={{
              label: content.label,
              sort_weight: content.sort_weight,
              content_sources: content.source_ids,
              viz_sources: viz.source_ids,
              related_products: content.product_ids,
              is_visible: content.is_visible,
              catalog_link: content.catalog_link ? content.catalog_link : "",
              census_link: content.census_link ? content.census_link : "",
            }}
            handleSave={handlePropertiesSave}
          />
        </div>
      )}
      <UnsavedChangesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        handleContinue={handleContinue}
      >
        You have unsaved changes.
      </UnsavedChangesModal>
    </div>
  );
}
