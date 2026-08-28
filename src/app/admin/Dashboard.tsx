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

export default function Dashboard() {
  const [selectedGeoLevel, setSelectedGeoLevel] = useState<GeoLevel>("county");
  const [selectedMode, setSelectedMode] = useState<Mode>("content");
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedTreeLevel, setSelectedTreeLevel] = useState<TreeLevel>("");
  const [contentText, setContentText] = useState<string>("");

  const [hasEdits, setHasEdits] = useState(false);

  const [pendingChange, setPendingChange] = useState<PendingChange>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const geoid =
    selectedGeoLevel === "region" ? undefined : defaultGeoids[selectedGeoLevel];
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

  function applySelection(id: number, treeLevel: TreeLevel) {
    setSelectedTreeLevel(treeLevel);
    if (treeLevel === "subcategory") {
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
      {selectedMode == 'content' && (
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
      {selectedMode == 'viz' && (
        <div className="col-start-2 row-span-3 col-span-3 bg-white p-2 rounded-md">
          <VizTable topicId={selectedId} geoLevel={selectedGeoLevel} />
        </div>
      )}
      {selectedMode === "properties" && (
        <div className="col-start-2 row-span-3 col-span-3 bg-white p-2 rounded-md">
          {selectedTreeLevel === "topic" && (
            <TopicPropertiesForm id={selectedId} />
          )}
        </div>
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
