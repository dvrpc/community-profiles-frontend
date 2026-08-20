"use client";

import { useEffect, useState } from "react";
import {
  useTree,
  useProfile,
  useHistory,
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
import ContentWrapper from "./Content/ContentWrapper";
import VizWrapper from "./Viz/VizWrapper";
import VersionControl from "./Content/VersionControl";
import UnsavedChangesModal from "./UnsavedChangesModal";
import {
  Category,
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
import { useAdminToast } from "./Toast/AdminToast";

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

function getSubcategoryById(subcategoryId: number, tree?: Category[]) {
  if (tree) {
    for (const category of tree) {
      const subcat = (category.subcategories ?? []).find(
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
    selectedGeoLevel === "region" ? undefined : defaultGeoids[selectedGeoLevel];
  const { data: session } = useSession();
  const { data: tree } = useTree(selectedGeoLevel);
  const { data: content } = useContent(selectedId, selectedTreeLevel);
  const { data: viz } = useViz(selectedId);
  const { data: history } = useHistory(selectedMode, selectedId);

  const saveMutation = useSave();
  const subcategoryUpdateMutation = useUpdateSubcategory();
  const topicUpdateMutation = useUpdateTopic();
  const propertiesMutation = useUpdateProperties();
  const { showToast, showError } = useAdminToast();

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

  function saveContent() {
    const user = session?.user.name;
    if (!user) return;

    const body = {
      user: user,
      text: contentText,
    };
    const url = `/content/${selectedId}`;

    saveMutation.mutate(
      { url, body },
      {
        onSuccess: () => {
          setHasEdits(false);
          showToast(`Content (ID: ${selectedId}) saved successfully.`);
        },
        onError: (err) => {
          console.error("Failed to save changes", err);
          showError(err, `Failed to save content (ID: ${selectedId})`);
        },
      },
    );
  }

  function saveViz() {
    const user = session?.user.name;
    if (!user || !viz) return;

    saveMutation.mutate(
      {
        url: `/viz/${selectedId}`,
        body: { user, text: JSON.stringify(vizData) },
      },
      {
        onSuccess: () => {
          setHasEdits(false);
          showToast(`Visualizations (ID: ${selectedId}) saved successfully.`);
        },
        onError: (error) =>
          showError(error, `Failed to save visualizations (ID: ${selectedId})`),
      },
    );

    propertiesMutation.mutate(
      { id: viz.id, payload: { viz_sources: vizSourceIds } },
      {
        onSuccess: () =>
          showToast(
            `Visualization sources saved successfully (ID: ${viz.id}).`,
          ),
        onError: (error) =>
          showError(
            error,
            `Failed to save visualization sources (ID: ${viz.id})`,
          ),
      },
    );
  }

  function handleSaveClick() {
    if (selectedMode === "content") saveContent();
    if (selectedMode === "viz") saveViz();
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
      topicUpdateMutation.mutate(
        { topicId, topic: { label, sort_weight } },
        {
          onSuccess: () =>
            showToast(`Topic saved successfully (ID: ${topicId}).`),
          onError: (error) =>
            showError(error, `Failed to save topic (ID: ${topicId})`),
        },
      );
    }
    propertiesMutation.mutate(
      { id, payload: rest },
      {
        onSuccess: () =>
          showToast(`Topic properties saved successfully (ID: ${id}).`),
        onError: (error) =>
          showError(error, `Failed to save topic properties (ID: ${id})`),
      },
    );
  }

  function handleSubcategoryPropertiesSave(
    subcategoryId: number,
    payload: Partial<SubcategoryPropertyForm>,
  ) {
    subcategoryUpdateMutation.mutate(
      {
        subcategoryId,
        subcategory: {
          label: payload.label,
          sort_weight: payload.sort_weight,
        },
      },
      {
        onSuccess: () =>
          showToast(`Subcategory saved successfully (ID: ${subcategoryId}).`),
        onError: (error) =>
          showError(error, `Failed to save subcategory (ID: ${subcategoryId})`),
      },
    );
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
          handleClick={handleCategorySidebarSelect}
          geoLevel={selectedGeoLevel}
          setGeoLevel={setSelectedGeoLevel}
        />
      </div>
      {isEditorMode && (
        <>
          {content && (
            <ContentWrapper
              content={content}
              hasEdits={hasEdits}
              geoLevel={selectedGeoLevel}
              geoid={geoid}
              setHasEdits={setHasEdits}
            />
          )}
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
