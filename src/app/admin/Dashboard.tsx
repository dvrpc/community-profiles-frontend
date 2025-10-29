"use client";

import { useEffect, useState } from "react";
import {
  API_BASE_URL,
  SMALL_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY,
} from "@/consts";
import { CategoryKeyMap, Content, GeoLevel, Visualization } from "@/types";

import CategorySidebar from "./CategorySidebar";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownPreview from "./MarkdownPreview";
import VersionControl from "./VersionControl";
import UnsavedChangesModal from "./UnsavedChangesModal";
import Button from "@/components/Buttons/Button";
import VizEditor from "./VizEditor";
import VizPreview from "./VizPreview";

export type Mode = "content" | "viz";

export default function Dashboard() {
  const [geoLevel, setGeoLevel] = useState<GeoLevel>("county");
  const [selectedMode, setSelectedMode] = useState<Mode>("content");

  const [editText, setEditText] = useState("");
  const [contentPreview, setContentPreview] = useState<string>("");
  const [visualizationsPreview, setVisualizationsPreview] = useState<
    Visualization[]
  >([]);
  const [history, setHistory] = useState<Content[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState("");
  const [activeTopic, setActiveTopic] = useState("");

  const [hasEdits, setHasEdits] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [tree, setTree] = useState<CategoryKeyMap>();
  const [pendingTopic, setPendingTopic] = useState<{
    category: string;
    subcategory: string;
    topic: string;
  } | null>(null);

  async function loadData(
    category: string,
    subcategory: string,
    topic: string,
    mode: Mode
  ) {
    fetchTemplate(category, subcategory, topic, mode);
    fetchHistory(category, subcategory, topic, mode);
  }

  async function fetchTemplate(
    category: string,
    subcategory: string,
    topic: string,
    mode: Mode
  ) {
    try {
      const params = new URLSearchParams({ category, subcategory, topic });
      const res = await fetch(
        `${API_BASE_URL}/${mode}/template/${geoLevel}?${params}`
      );
      if (!res.ok) throw new Error(`Failed to fetch ${mode} template`);

      const text = await res.json();
      setActiveCategory(category);
      setActiveSubcategory(subcategory);
      setActiveTopic(topic);
      setEditText(text);
      setHasEdits(false);
    } catch (err) {
      console.error(`Error fetching ${mode} template:`, err);
    }
  }

  async function fetchHistory(
    category: string,
    subcategory: string,
    topic: string,
    mode: Mode
  ) {
    try {
      const params = new URLSearchParams({ category, subcategory, topic });
      const res = await fetch(
        `${API_BASE_URL}/${mode}/history/${geoLevel}?${params}`
      );
      if (!res.ok) throw new Error(`${mode} history fetch failed`);

      const history = await res.json();
      setHistory(history);
    } catch (err) {
      console.error(`Error fetching ${mode} history:`, err);
    }
  }

  async function fetchPreview(
    template: string,
    category: string,
    subcategory: string,
    topic: string,
    mode: Mode
  ) {
    if (!category || !subcategory || !topic) return;

    if (mode == "viz") {
      template = JSON.stringify(template);
    }
    try {
      const res = await fetch(`${API_BASE_URL}/${mode}/preview/${geoLevel}`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: template,
      });
      if (!res.ok) throw new Error(`${mode} Preview fetch failed`);

      const data = await res.json();

      if (mode == "content") {
        setContentPreview(data);
      } else {
        setVisualizationsPreview(data);
      }
    } catch (err) {
      console.error(`Error fetching ${mode} preview:`, err);
    }
  }

  async function saveChanges() {
    const params = new URLSearchParams({
      category: activeCategory,
      subcategory: activeSubcategory,
      topic: activeTopic,
    });

    const body =
      selectedMode == "content" ? editText : JSON.stringify(editText);

    try {
      const res = await fetch(
        `${API_BASE_URL}/${selectedMode}/${geoLevel}?${params}`,
        {
          method: "PUT",
          headers: { "Content-Type": "text/plain" },
          body: body,
        }
      );
      if (!res.ok) throw new Error(`Failed to updated ${selectedMode}`);
      fetchHistory(
        activeCategory,
        activeSubcategory,
        activeTopic,
        selectedMode
      );
      setHasEdits(false);
    } catch (err) {
      console.error(`Error updating ${selectedMode}:`, err);
    }
  }

  async function handleModeChange(mode: Mode) {
    setSelectedMode(mode);
    if (activeTopic) {
      loadData(activeCategory, activeSubcategory, activeTopic, mode);
    }
  }

  async function handleTopicSelect(
    category: string,
    subcategory: string,
    topic: string
  ) {
    if (hasEdits) {
      setPendingTopic({ category, subcategory, topic });
      setModalOpen(true);
      return;
    }

    await loadData(category, subcategory, topic, selectedMode);
  }

  function handleModalClose() {
    setPendingTopic(null);
    setModalOpen(false);
  }

  async function handleContinue(save: boolean) {
    if (save) {
      saveChanges();
    }

    if (pendingTopic) {
      setModalOpen(false);
      setHasEdits(false);
      await loadData(
        pendingTopic.category,
        pendingTopic.subcategory,
        pendingTopic.topic,
        selectedMode
      );
      setPendingTopic(null);
    }
  }

  const handleSaveClick = () => {
    if (hasEdits) {
      saveChanges();
    }
  };

  useEffect(() => {
    fetchPreview(
      editText,
      activeCategory,
      activeSubcategory,
      activeTopic,
      selectedMode
    );
  }, [editText, activeCategory, activeSubcategory, activeTopic]);

  useEffect(() => {});

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/content/template/tree/${geoLevel}`
        );
        if (!res.ok) throw new Error("Failed to fetch tree");
        const data = (await res.json()) as CategoryKeyMap;
        setTree(data);
      } catch (err) {
        console.error("Error loading tree:", err);
      }
    };

    fetchTree();
  }, [geoLevel]);

  return (
    <div className={`flex ${SMALL_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY}`}>
      <CategorySidebar
        tree={tree}
        handleClick={handleTopicSelect}
        mode={selectedMode}
        handleModeChange={handleModeChange}
        geoLevel={geoLevel}
        setGeoLevel={setGeoLevel}
      />

      <div className="w-full flex">
        <div className="w-1/2">
          <div className="p-4 border-b-2 border-dvrpc-gray-7 h-20">
            <h3 className="text-dvrpc-blue-1 text-3xl">Editor</h3>
          </div>
          {selectedMode == "content" ? (
            <MarkdownEditor
              value={editText}
              setValue={setEditText}
              hasEdits={hasEdits}
              setHasEdits={setHasEdits}
            />
          ) : (
            <VizEditor
              visualizations={editText}
              setVisualizations={setEditText}
              hasEdits={hasEdits}
              setHasEdits={setHasEdits}
            />
          )}
        </div>
        <div className="w-1/2">
          <div className="border-b-2 border-dvrpc-gray-7 flex justify-between p-4 h-20">
            <h3 className="text-dvrpc-blue-1 text-3xl">Preview</h3>
            <Button
              type="primary"
              disabled={!hasEdits}
              handleClick={handleSaveClick}
            >
              Save Changes
            </Button>
          </div>
          {selectedMode == "content" ? (
            <MarkdownPreview content={contentPreview} />
          ) : (
            <VizPreview visualizations={visualizationsPreview} />
          )}
        </div>
      </div>

      <VersionControl
        contentHistory={history}
        setEditContent={setEditText}
        setHasEdits={setHasEdits}
      />

      <UnsavedChangesModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        handleContinue={handleContinue}
      >
        You have unsaved changes.
      </UnsavedChangesModal>
    </div>
  );
}
