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
import {
  CategoryKeyMap,
  GeoLevel,
  SubcategoryPropertyForm,
  TopicPropertyForm,
  Visualization,
} from "@/types/types";
import Header from "./Header";
import SourceEditor from "./Source/SourceEditor";
import TopicPropertiesForm from "./Form/TopicPropertiesForm";
import SubcategoryPropertiesForm from "./Form/SubcategoryPropertiesForm";
import { useSession } from "next-auth/react";
import VariableEditor from "./Variables/VariableEditor";
import SqlEditor from "./SQL/SqlEditor";
import BuildStatus from "./Build/BuildStatus";

const defaultGeoids = {
  county: "42101",
  municipality: "4201704976",
};

export type Mode =
  | "content"
  | "viz"
  | "properties"
  | "sources"
  | "variables"
  | "sql";
export type TreeLevel = "category" | "subcategory" | "topic" | "";

type PendingChange =
  | { type: "selection"; id: number; treeLevel: TreeLevel }
  | { type: "mode"; mode: Mode }
  | null;

function getSubcategoryById(subcategoryId: number, tree?: CategoryKeyMap) {
  if (tree) {
    for (const category of Object.values(tree)) {
      const subcat = category.subcategories.find(
        (sub) => sub.id === subcategoryId,
      );
      if (subcat) return subcat;
    }
  }
  return null;
}

export default function Dashboard() {
  const [selectedGeoLevel, setSelectedGeoLevel] = useState<GeoLevel>("county");
  const [selectedMode, setSelectedMode] = useState<Mode>("content");
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number>(0);
  const [selectedTreeLevel, setSelectedTreeLevel] = useState<TreeLevel>("");
  const [contentText, setContentText] = useState<string>("");
  const [vizData, setVizData] = useState<Visualization[] | null>(null);
  const [vizSourceIds, setVizSourceIds] = useState<number[]>([]);

  const [hasEdits, setHasEdits] = useState(false);

  const [pendingChange, setPendingChange] = useState<PendingChange>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const geoid =
    selectedGeoLevel === "region"
      ? undefined
      : defaultGeoids[selectedGeoLevel];
  const { data: session } = useSession();
  const { data: tree } = useTree(selectedGeoLevel);
  const { data: profile } = useProfile(selectedGeoLevel, geoid);
  const { data: content } = useContent(selectedId);
  const { data: viz } = useViz(selectedId);
  const { data: history } = useHistory(selectedMode, selectedId);
  const editText = selectedMode === "content" ? contentText : vizData;
  const { data: preview } = usePreview(
    editText,
    selectedMode,
    selectedGeoLevel,
    geoid,
  );

  const saveMutation = useSave();
  const subcategoryUpdateMutation = useUpdateSubcategory();
  const topicUpdateMutation = useUpdateTopic();
  const subcategoryCreateMutation = useCreateSubcategory();
  const topicCreateMutation = useCreateTopic();
  const topicDeleteMutation = useDeleteTopic();
  const subcategoryDeleteMutation = useDeleteSubcategory();
  const propertiesMutation = useUpdateProperties();

  const selectedSubcategory = getSubcategoryById(selectedSubcategoryId, tree);

  useEffect(() => {
    if (selectedMode === "content" && content) setContentText(content["file"]);
    if (selectedMode === "viz" && viz) {
      setVizData(JSON.parse(viz["file"]));
      setVizSourceIds(viz.source_ids);
    }
  }, [content, viz, selectedMode]);

  function resetEditors() {
    setContentText("");
    setVizData(null);
    setVizSourceIds([]);
  }

  function applySelection(id: number, treeLevel: TreeLevel) {
    setSelectedTreeLevel(treeLevel);

    if (treeLevel === "subcategory") {
      setSelectedSubcategoryId(id);
      setSelectedMode("properties");
      return;
    }

    setSelectedId(id);
    if (!["content", "viz", "properties"].includes(selectedMode)) {
      setSelectedMode("content");
    }
  }

  function handleCategorySidebarSelect(id: number, newTreeLevel: TreeLevel) {
    if (hasEdits) {
      setPendingChange({ type: "selection", id, treeLevel: newTreeLevel });
      setModalOpen(true);
      return;
    }

    applySelection(id, newTreeLevel);
  }

  function handleContinue(save: boolean) {
    if (save) {
      handleSaveClick();
    }

    if (!pendingChange) {
      setModalOpen(false);
      return;
    }

    if (pendingChange.type === "selection") {
      applySelection(pendingChange.id, pendingChange.treeLevel);
    } else {
      setSelectedMode(pendingChange.mode);
      resetEditors();
    }

    setModalOpen(false);
    setHasEdits(false);
    setPendingChange(null);
  }

  function handleSaveClick() {
    const user = session?.user.name;
    if (!user) return;

    const bodyText =
      selectedMode === "content" ? contentText : JSON.stringify(vizData);

    const body = {
      user: user,
      text: bodyText,
    };
    const url = `/${selectedMode}/${selectedId}`;

    saveMutation.mutate(
      { url, body },
      {
        onSuccess: () => setHasEdits(false),
        onError: (err) => {
          console.error("Failed to save changes", err);
          // TODO: toast notification for error
        },
      },
    );

    if (selectedMode === "viz" && viz) {
      propertiesMutation.mutate({
        id: viz.id,
        payload: { viz_sources: vizSourceIds },
      });
    }
  }

  function handleContentEdit(value: string) {
    setContentText(value);
    setHasEdits(true);
  }

  function handleVizEdit(value: Visualization[]) {
    setVizData(value);
    setHasEdits(true);
  }

  function handleVizSourcesEdit(sourceIds: number[]) {
    setVizSourceIds(sourceIds);
    setHasEdits(true);
  }

  function handleModeChange(mode: Mode) {
    if (hasEdits && mode !== selectedMode) {
      setPendingChange({ type: "mode", mode });
      setModalOpen(true);
      return;
    }

    resetEditors();
    setSelectedMode(mode);
  }

  function handleVersionChange(file: string, index: number) {
    if (selectedMode === "content") {
      setContentText(file);
    } else {
      setVizData(JSON.parse(file));
    }
    setHasEdits(index > 0);
  }

  function handleTopicPropertiesSave(
    id: number,
    topicId: number,
    payload: Partial<TopicPropertyForm>,
  ) {

    const { label, sort_weight, ...rest } = payload;

    if (label !== undefined || sort_weight !== undefined) {
      topicUpdateMutation.mutate({
        topicId,
        topic: { label, sort_weight },
      });
    }
    propertiesMutation.mutate({ id, payload: rest });
  }

  function handleSubcategoryPropertiesSave(
    subcategoryId: number,
    payload: Partial<SubcategoryPropertyForm>,
  ) {
    subcategoryUpdateMutation.mutate({
      subcategoryId,
      subcategory: {
        label: payload.label,
        sort_weight: payload.sort_weight,
      },
    });
  }

  function getPreview() {
    if (!preview) return null;

    if (selectedMode === "content")
      return <MarkdownPreview content={preview as string} />;

    if (profile) {
      return (
        <VizPreview
          visualizations={preview as Visualization[]}
          buffer_bbox={profile.geography.buffer_bbox}
          geoLevel={selectedGeoLevel}
          geoid={profile.geography.geoid}
        />
      );
    }

    return <p className="text-gray-400 italic">Loading preview…</p>;
  }

  function addSubcategory(categoryId: number, newSubcat: string) {
    subcategoryCreateMutation.mutate({ categoryId, newSubcat });
  }

  function addTopic(subcatId: number, newTopic: string) {
    topicCreateMutation.mutate({ subcatId, newTopic });
  }

  function updateSubcategory(subcategoryId: number, newSubcat: string) {
    subcategoryUpdateMutation.mutate({
      subcategoryId,
      subcategory: { name: newSubcat },
    });
  }

  function updateTopic(topicId: number, newTopic: string) {
    topicUpdateMutation.mutate({
      topicId,
      topic: { name: newTopic },
    });
  }

  function deleteTopic(topicId: number) {
    if (!window.confirm("Delete this topic? This cannot be undone.")) return;
    topicDeleteMutation.mutate(topicId);
  }

  function deleteSubcategory(subcatId: number) {
    if (!window.confirm("Delete this subcategory? This cannot be undone."))
      return;
    subcategoryDeleteMutation.mutate(subcatId);
  }

  const isEditorMode = selectedMode === "content" || selectedMode === "viz";

  return (
    <div className="h-screen grid grid-cols-[250px_1fr_1fr_250px] grid-rows-[80px_1fr_200px] gap-2 p-2">
      <div className="col-span-3 col-start-2 p-2 bg-white flex justify-between rounded-md">
        <Header
          currentTab={selectedMode}
          setCurrentTab={handleModeChange}
          treeLevel={selectedTreeLevel}
        />
      </div>
      <div className="p-2 col-start-1 row-start-1">
        <h1 className="text-2xl text-dvrpc-blue-1">Community Profiles</h1>
        <span>Admin Dashboard</span>
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
      {isEditorMode && (
        <>
          <div className="col-start-2 row-start-2 row-span-2 bg-white p-2 rounded-md overflow-auto">
            <h3 className="text-xl p-2 mb-2">Editor</h3>

            {selectedMode === "content" ? (
              <MarkdownEditor
                value={contentText}
                handleChange={handleContentEdit}
              />
            ) : (
              <VizEditor
                visualizations={vizData ?? []}
                handleChange={handleVizEdit}
                sourceIds={viz?.source_ids ?? []}
                sourceResetKey={`${viz?.id ?? "new"}:${viz?.file ?? ""}`}
                handleSourcesChange={handleVizSourcesEdit}
              />
            )}
          </div>
          <div className="col-start-3 row-start-2 row-span-2 bg-white p-2 rounded-md overflow-auto">
            <div className="flex justify-between p-2 mb-2">
              <h3 className="text-xl">Preview</h3>
              <Button
                disabled={!hasEdits || saveMutation.isPending}
                handleClick={handleSaveClick}
                type={"primary"}
              >
                {saveMutation.isPending ? "Saving…" : "Save Changes"}
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
      {selectedMode === "sources" && (
        <div className="col-start-2 row-span-3 col-span-3 bg-white p-2 rounded-md">
          <SourceEditor />
        </div>
      )}
      {selectedMode === "variables" && (
        <div className="col-start-2 row-span-3 col-span-3 bg-white p-2 rounded-md flex-col flex">
          <BuildStatus />
          <VariableEditor />
        </div>
      )}
      {selectedMode === "sql" && (
        <div className="col-start-2 row-span-3 col-span-3 bg-white p-2 rounded-md flex-col flex">
          <BuildStatus />
          <SqlEditor />
        </div>
      )}
      {selectedMode === "properties" && (
        <div className="col-span-3 col-start-2 row-span-2 row-start-2 bg-white p-2 rounded-md overflow-auto">
          {selectedTreeLevel === "topic" && content && viz && (
            <TopicPropertiesForm
              id={content.id}
              topic_id={content.topic_id}
              initialData={{
                label: content.label,
                sort_weight: content.sort_weight,
                content_sources: content.source_ids,
                viz_sources: viz.source_ids,
                related_products: content.product_ids,
                is_visible: content.is_visible,
                catalog_link: content.catalog_link,
                census_link: content.census_link,
                other_link: content.other_link,
              }}
              handleSave={handleTopicPropertiesSave}
            />
          )}
          {selectedTreeLevel === "subcategory" && selectedSubcategory && (
            <SubcategoryPropertiesForm
              id={selectedSubcategoryId}
              initialData={{
                label: selectedSubcategory?.label,
                sort_weight: selectedSubcategory?.sort_weight,
              }}
              handleSave={handleSubcategoryPropertiesSave}
            />
          )}
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
