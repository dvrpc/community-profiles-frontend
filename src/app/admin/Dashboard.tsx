"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL, SMALL_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY } from "@/consts";
import { CategoryKeyMap, Content, GeoLevel } from "@/types";

import CategorySidebar from "./CategorySidebar";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownPreview from "./MarkdownPreview";
import VersionControl from "./VersionControl";
import UnsavedChangesModal from "./UnsavedChangesModal";

export default function Dashboard() {
    const [geoLevel, setGeoLevel] = useState<GeoLevel>("county");
    const [editType, setEditType] = useState<"content" | "visualization">("content");

    const [editContent, setEditContent] = useState("");
    const [previewContent, setPreviewContent] = useState("");
    const [contentHistory, setContentHistory] = useState<Content[]>([])
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


    async function fetchContent(category: string, subcategory: string, topic: string) {
        fetchContentTemplate(category, subcategory, topic)
        fetchContentHistory(category, subcategory, topic)
    }

    async function fetchContentTemplate(category: string, subcategory: string, topic: string) {
        try {
            const params = new URLSearchParams({ category, subcategory, topic });
            const res = await fetch(`${API_BASE_URL}/content/template/${geoLevel}?${params}`);
            if (!res.ok) throw new Error("Failed to fetch content template");

            const text = await res.text();
            setActiveCategory(category);
            setActiveSubcategory(subcategory);
            setActiveTopic(topic);
            setEditContent(JSON.parse(text));
            setHasEdits(false);
        } catch (err) {
            console.error("Error fetching template:", err);
        }
    }

    async function fetchContentHistory(category: string, subcategory: string, topic: string) {
        try {
            const params = new URLSearchParams({ category, subcategory, topic });
            const res = await fetch(`${API_BASE_URL}/content/history/${geoLevel}?${params}`);
            if (!res.ok) throw new Error("Content history fetch failed");

            const content = await res.json()
            console.log(content)
            setContentHistory(content);
        } catch (err) {
            console.error("Error fetching content history:", err);
        }
    }

    async function fetchPreviewContent(
        template: string,
        category: string,
        subcategory: string,
        topic: string
    ) {
        if (!category || !subcategory || !topic) return;

        try {
            const res = await fetch(`${API_BASE_URL}/content/preview/${geoLevel}`, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: template,
            });
            if (!res.ok) throw new Error("Preview fetch failed");

            const text = await res.text();
            setPreviewContent(JSON.parse(text));
        } catch (err) {
            console.error("Error fetching preview:", err);
        }
    }

    async function handleTopicSelect(category: string, subcategory: string, topic: string) {
        if (hasEdits) {
            setPendingTopic({ category, subcategory, topic });
            setModalOpen(true);
            return;
        }

        await fetchContent(category, subcategory, topic);
    }

    function handleModalClose() {
        setPendingTopic(null);
        setModalOpen(false);
    }

    async function handleContinue(save: boolean) {
        if (save) {
            saveChanges()
        }

        if (pendingTopic) {
            setModalOpen(false);
            setHasEdits(false);
            await fetchContent(
                pendingTopic.category,
                pendingTopic.subcategory,
                pendingTopic.topic
            );
            setPendingTopic(null);
        }
    }

    async function saveChanges() {
        const params = new URLSearchParams({ category: activeCategory, subcategory: activeSubcategory, topic: activeTopic });

        try {
            const res = await fetch(`${API_BASE_URL}/content/${geoLevel}?${params}`, {
                method: "PUT",
                headers: { "Content-Type": "text/plain" },
                body: editContent,
            });
            if (!res.ok) throw new Error("Failed to updated content");
            fetchContentHistory(activeCategory, activeSubcategory, activeTopic)
            setHasEdits(false)
        } catch (err) {
            console.error("Error updating content:", err);
        }
    }


    useEffect(() => {
        fetchPreviewContent(editContent, activeCategory, activeSubcategory, activeTopic);
    }, [editContent, activeCategory, activeSubcategory, activeTopic]);

    useEffect(() => {
        const fetchTree = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/content/template/tree/${geoLevel}`);
                if (!res.ok) throw new Error("Failed to fetch content tree");
                const data = (await res.json()) as CategoryKeyMap;
                setTree(data);
            } catch (err) {
                console.error("Error loading content tree:", err);
            }
        };

        fetchTree();
    }, [geoLevel]);

    return (
        <div className={`flex ${SMALL_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY}`}>
            <CategorySidebar tree={tree} handleClick={handleTopicSelect} />

            <MarkdownEditor
                value={editContent}
                setValue={setEditContent}
                hasEdits={hasEdits}
                setHasEdits={setHasEdits}
            />

            <MarkdownPreview content={previewContent} hasEdits={hasEdits} saveChanges={saveChanges} />
            <VersionControl contentHistory={contentHistory} setEditContent={setEditContent} setHasEdits={setHasEdits} />

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