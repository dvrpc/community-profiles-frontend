"use client"
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ContextStore } from "@uiw/react-md-editor";


interface Props {
    value: string;
    setValue: (value: string) => void;
}

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);


export default function MarkdownEditor(props: Props) {
    const { value, setValue } = props



    const handleChange = (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!event?.currentTarget) return;
        setValue(event.currentTarget.value)
    }

    return (
        <div className="w-1/2">
            <div className="p-4 border-b-2 border-dvrpc-gray-7 h-20">
                <h3 className="text-dvrpc-blue-1 text-3xl">Editor</h3>

            </div>
            <MDEditor height="100%" value={value} onChange={handleChange} />

        </div>
    )
}