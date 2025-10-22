"use client"

import { API_BASE_URL, SMALL_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY } from "@/consts";
import { CategoryKeyMap, GeoLevel } from "@/types";
import { useEffect, useState } from "react";
import CategorySidebar from "./CategorySidebar";
import MarkdownEditor from "./MarkdownEditor";
import VersionControl from "./VersionControl";
import MarkdownPreview from "./MarkdownPreview";

export default function Dashboard() {
    const [geoLevel, setGeoLevel] = useState<GeoLevel>("county")
    const [editType, setEditType] = useState<'content' | 'visualization'>('content')
    const [editContent, setEditContent] = useState('');
    const [previewContent, setPreviewContent] = useState('');
    const [activeCategory, setActiveCategory] = useState('')
    const [activeSubategory, setActiveSubctegory] = useState('')
    const [activeTopic, setActiveTopic] = useState('')

    const [tree, setTree] = useState<CategoryKeyMap>()


    useEffect(() => {
        const fetchTree = async () => {
            const treeResponse = await fetch(
                `${API_BASE_URL}/content/template/tree/${geoLevel}`
            );
            const treeJson = (await treeResponse.json()) as CategoryKeyMap
            setTree(treeJson)
        };

        fetchTree();
    }, [])

    async function fetchContentTemplate(category: string, subcategory: string, topic: string) {
        const searchParams = new URLSearchParams({
            category: category,
            subcategory: subcategory,
            topic: topic,
        });


        setActiveCategory(category)
        setActiveSubctegory(subcategory)
        setActiveTopic(topic)

        const contentTemplateResponse = await fetch(
            `${API_BASE_URL}/content/template/${geoLevel}?${searchParams}`
        );

        return contentTemplateResponse.text()
    }

    async function fetchPreviewContent(template: string, category: string, subcategory: string, topic: string) {
        const searchParams = new URLSearchParams({
            category: category,
            subcategory: subcategory,
            topic: topic,
        });



        const previewTemplateResponse = await fetch(
            `${API_BASE_URL}/content/preview?${searchParams}`, {
            method: "POST",
            headers: {
                'Content-Type': 'text/plain',
            },
            body: template

        }
        );

        const text = await previewTemplateResponse.text()
        console.log(text)
        setPreviewContent(JSON.parse(text))
    }

    const handleTopicSelect = async (category: string, subcategory: string, topic: string) => {
        const content = await fetchContentTemplate(category, subcategory, topic)
        setEditContent(JSON.parse(content))
    }

    useEffect(() => {
        fetchPreviewContent(editContent, activeCategory, activeSubategory, activeTopic)
    }, [editContent])


    return (
        <div className={`flex ${SMALL_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY}`}>
            <CategorySidebar tree={tree} handleClick={handleTopicSelect} />
            {/* <MarkdownPreview /> */}
            <MarkdownEditor value={editContent} setValue={setEditContent} />
            <MarkdownPreview content={previewContent} />
            <VersionControl />
        </div>
    )
}