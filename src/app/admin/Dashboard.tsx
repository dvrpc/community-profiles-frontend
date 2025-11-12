"use client";

import { useEffect, useState } from "react";
import {
  useTree,
  useProfile,
  useTemplate,
  useHistory,
  usePreview,
  useSave,
} from "../../lib/hooks";
import { SMALL_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY } from "@/consts";
import CategorySidebar from "./CategorySidebar";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownPreview from "./MarkdownPreview";
import VizEditor from "./VizEditor";
import VizPreview from "./VizPreview";
import VersionControl from "./VersionControl";
import UnsavedChangesModal from "./UnsavedChangesModal";
import Button from "@/components/Buttons/Button";
import { GeoLevel, Visualization } from "@/types/types";
import { getSession } from "next-auth/react";
import Tabs from "./Header";
import SourceEditor from "./SourceEditor";

const defaultGeoid = {
  region: "",
  county: "42101",
  municipality: "4201704976",
};

export type Mode = "content" | "viz" | "sources";

export default function Dashboard() {
  const [selectedGeoLevel, setSelectedGeoLevel] = useState<GeoLevel>("county");
  const [selectedMode, setSelectedMode] = useState<Mode>("content");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const [editText, setEditText] = useState("");
  const [hasEdits, setHasEdits] = useState(false);

  const [pendingTopic, setPendingTopic] = useState<{
    category: string;
    subcategory: string;
    topic: string;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const geoid = defaultGeoid[selectedGeoLevel];

  const { data: tree } = useTree(selectedGeoLevel);
  const { data: profile } = useProfile(selectedGeoLevel, geoid);
  const { data: template } = useTemplate(
    selectedCategory,
    selectedSubcategory,
    selectedTopic,
    selectedMode,
    selectedGeoLevel
  );
  const { data: history } = useHistory(
    selectedCategory,
    selectedSubcategory,
    selectedTopic,
    selectedMode,
    selectedGeoLevel
  );

  const { data: preview } = usePreview(
    editText,
    selectedMode,
    selectedGeoLevel,
    geoid
  );

  const saveMutation = useSave();

  useEffect(() => {
    if (template) setEditText(template);
  }, [template]);

  function handleTopicSelect(
    category: string,
    subcategory: string,
    topic: string
  ) {
    if (hasEdits) {
      setPendingTopic({ category, subcategory, topic });
      setModalOpen(true);
      return;
    }

    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setSelectedTopic(topic);
  }

  function handleContinue(save: boolean) {
    if (save) {
      handleSaveClick();
    }
    const { category, subcategory, topic } = pendingTopic!;
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setSelectedTopic(topic);
    setModalOpen(false);
    setHasEdits(false);
    setPendingTopic(null);
  }

  function handleSaveClick() {
    const body =
      selectedMode === "content" ? editText : JSON.stringify(editText);
    const url = `/${selectedMode}/${selectedGeoLevel}?category=${selectedCategory}&subcategory=${selectedSubcategory}&topic=${selectedTopic}`;
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
    setEditText(file);
    setHasEdits(index > 0);
  }


  function getPreview() {
    // this is not great but needed some type workarounds, preview api call should be split up
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

  return (
    <div className='h-screen grid grid-cols-[250px_1fr_1fr_250px] grid-rows-[80px_1fr_200px] x gap-2 p-2'>
      <div className="row-span-3 p-2 overflow-auto">
        <CategorySidebar
          tree={tree}
          handleClick={handleTopicSelect}
          mode={selectedMode}
          handleModeChange={handleModeChange}
          geoLevel={selectedGeoLevel}
          setGeoLevel={setSelectedGeoLevel}
        />
      </div>
      <div className="col-span-3 p-2 bg-white flex justify-between rounded-md">
        <Tabs currentTab={selectedMode} setCurrentTab={handleModeChange} />
      </div>
      {selectedMode != 'sources' ? <>
        <div className="col-start-2 row-start-2 bg-white p-2 flex flex-col rounded-md overflow-auto">
          <h3 className="text-xl p-2 mb-2">Editor</h3>

          {selectedMode === "content" ? (
            <MarkdownEditor value={editText} handleChange={handleContentEdit} />
          ) : (
            <VizEditor visualizations={editText} handleChange={handleVizEdit} />
          )}
        </div>
        <div className="col-start-3 row-start-2 bg-white p-2 rounded-md overflow-auto">
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
        <div className="col-span-2 col-start-2 row-start-3 bg-white p-2 rounded-md">
        </div>
        <div className="row-span-2 col-start-4 row-start-2 bg-white rounded-md">
          <VersionControl
            contentHistory={history || []}
            handleClick={handleVersionChange}
          />
        </div></> :
        <div className="col-start-2 row-span-3 col-span-3 bg-white p-2 rounded-md">
          <SourceEditor />
        </div>
      }


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
