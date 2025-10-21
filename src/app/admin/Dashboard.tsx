"use client"

import { API_BASE_URL } from "@/consts";
import { CategoryKeyMap, GeoLevel } from "@/types";
import { useEffect, useState } from "react";
import CategorySidebar from "./CategorySidebar";
import MarkdownPreview from "./MardownPreview";
import MarkdownEditor from "./MarkdownEditor";

export default function Dashboard() {
    const [geoLevel, setGeoLevel] = useState<GeoLevel>("county")
    const [editType, setEditType] = useState<'content' | 'visualization'>('content')
    const [selectedContent, setSelectedContent] = useState('');
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

        const contentTemplateResponse = await fetch(
            `${API_BASE_URL}/content/template/${geoLevel}?${searchParams}`
        );

        return contentTemplateResponse.text()
    }

    const handleTopicSelect = async (category: string, subcategory: string, topic: string) => {
        const content = await fetchContentTemplate(category, subcategory, topic)
        setSelectedContent(content)
        console.log(content)
    }


    return (
        <div className="flex">
            <CategorySidebar tree={tree} handleClick={handleTopicSelect} />
            {/* <MarkdownPreview /> */}
            <MarkdownEditor template={selectedContent} />
        </div>
    )
}