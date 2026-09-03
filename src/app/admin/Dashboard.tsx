"use client";

import { useEffect, useState } from "react";
import { useContent, useUpdateContent } from "../../lib/hooks";
import CategorySidebar from "./CategorySidebar/CategorySidebar";
import ContentWrapper from "./Content/ContentWrapper";
import VizTable from "./Viz/VizTable";
import UnsavedChangesModal from "./UnsavedChangesModal";
import { GeoLevel } from "@/types/types";
import Header from "./Header";
import SourceEditor from "./Source/SourceEditor";

import { useSession } from "next-auth/react";
import VariableEditor from "./Variables/VariableEditor";
import SqlEditor from "./SQL/SqlEditor";
import BuildStatus from "./Build/BuildStatus";
import { useAdminToast } from "./Toast/AdminToast";
import TopicPropertiesForm from "./Form/TopicPropertiesForm";
import SubcategoryPropertiesForm from "./Form/SubcategoryPropertiesForm";

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

export default function Dashboard() {
  const [selectedGeoLevel, setSelectedGeoLevel] = useState<GeoLevel>("county");
  const [selectedGeoid, setSelectedGeoid] = useState<string>("42017");
  const [selectedMode, setSelectedMode] = useState<Mode>("content");
  const [selectedId, setSelectedId] = useState<number>(1);
  const [selectedTreeLevel, setSelectedTreeLevel] =
    useState<TreeLevel>("category");
  const [contentText, setContentText] = useState<string>("");

  const [hasEdits, setHasEdits] = useState(false);

  const [pendingChange, setPendingChange] = useState<PendingChange>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const geoid = selectedGeoLevel === "region" ? undefined : selectedGeoid;
  const { data: session } = useSession();
  const { data: content } = useContent(selectedId, selectedTreeLevel);
  const updateContentMutation = useUpdateContent();
  const { showToast, showError } = useAdminToast();

  useEffect(() => {
    if (selectedMode === "content" && content) setContentText(content["file"]);
  }, [content, selectedMode]);

  function resetEditors() {
    setContentText("");
  }

  function handleGeolevelChange(geoLevel: GeoLevel) {
    setSelectedGeoLevel(geoLevel);
    if (selectedTreeLevel !== "category") {
      setSelectedId(1);
      setSelectedTreeLevel("category");
      if (selectedMode === "properties" || selectedMode === "viz") {
        setSelectedMode("content");
      }
    }
  }

  function applySelection(id: number, treeLevel: TreeLevel) {
    setSelectedTreeLevel(treeLevel);
    setSelectedId(id);

    if (treeLevel === "subcategory") {
      setSelectedMode("properties");
      return;
    }

    if (treeLevel === "category") {
      setSelectedMode("content");
      return;
    }

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

  const saveContent = () => {
    const user = session?.user.name;
    if (!user || !content) return;

    updateContentMutation.mutate(
      { id: content.id, payload: { file: contentText, last_edited_by: user } },
      {
        onSuccess: () => {
          setHasEdits(false);
          showToast(`Content (ID: ${content.id}) saved successfully.`);
        },
        onError: (err) =>
          showError(err, `Failed to save content (ID: ${content.id})`),
      },
    );
  };

  function handleSaveClick() {
    if (selectedMode === "content") saveContent();
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
    setContentText(file);
    setHasEdits(index > 0);
  }

  return (
    <div className="grid h-screen min-h-0 grid-cols-[280px_minmax(0,1fr)_minmax(0,1fr)_280px] grid-rows-[88px_minmax(0,1fr)] gap-2 bg-dvrpc-gray-7 p-2">
      <div className="col-span-4 col-start-1 flex items-center rounded-xl border border-dvrpc-gray-6 bg-white px-5 shadow-sm">
        <Header
          currentTab={selectedMode}
          setCurrentTab={handleModeChange}
          treeLevel={selectedTreeLevel}
        />
      </div>
      <aside className="col-start-1 row-start-2 min-h-0 overflow-y-auto rounded-xl border border-dvrpc-gray-6 bg-white p-3 shadow-sm">
        <CategorySidebar
          handleClick={handleCategorySidebarSelect}
          geoLevel={selectedGeoLevel}
          setGeoLevel={handleGeolevelChange}
          geoid={geoid}
          setGeoid={setSelectedGeoid}
          selectedId={selectedId}
          selectedTreeLevel={selectedTreeLevel}
        />
      </aside>
      {selectedMode == "content" && (
        <>
          {content && (
            <ContentWrapper
              value={contentText}
              content={content}
              hasEdits={hasEdits}
              geoLevel={selectedGeoLevel}
              geoid={geoid}
              isPending={updateContentMutation.isPending}
              handleSave={saveContent}
              setValue={setContentText}
              setHasEdits={setHasEdits}
              handleVersionChange={handleVersionChange}
            />
          )}
        </>
      )}
      {selectedMode == "viz" && (
        <div className="col-start-2 row-start-2 col-span-3 min-h-0 overflow-auto rounded-xl border border-dvrpc-gray-6 bg-white p-4 shadow-sm">
          <VizTable
            topicId={selectedId}
            geoLevel={selectedGeoLevel}
            geoid={geoid}
          />
        </div>
      )}
      {selectedMode === "properties" && (
        <div className="col-start-2 row-start-2 col-span-3 min-h-0 overflow-auto rounded-xl border border-dvrpc-gray-6 bg-white p-4 shadow-sm">
          {selectedTreeLevel === "topic" ? (
            <TopicPropertiesForm id={selectedId} />
          ) : (
            <SubcategoryPropertiesForm id={selectedId} />
          )}
        </div>
      )}
      {selectedMode === "sources" && (
        <div className="col-start-2 row-start-2 col-span-3 min-h-0 overflow-auto rounded-xl border border-dvrpc-gray-6 bg-white p-4 shadow-sm">
          <SourceEditor />
        </div>
      )}
      {selectedMode === "variables" && (
        <div className="col-start-2 row-start-2 col-span-3 min-h-0 overflow-auto rounded-xl border border-dvrpc-gray-6 bg-white p-4 shadow-sm flex flex-col">
          <BuildStatus />
          <VariableEditor />
        </div>
      )}
      {selectedMode === "sql" && (
        <div className="col-start-2 row-start-2 col-span-3 min-h-0 overflow-auto rounded-xl border border-dvrpc-gray-6 bg-white p-4 shadow-sm flex flex-col">
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
