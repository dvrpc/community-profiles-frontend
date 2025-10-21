"use client"
import MDEditor, { selectWord } from "@uiw/react-md-editor";
import { ChangeEvent, useState } from "react";

interface Props {
    template: string;
}

export default function MarkdownEditor(props: Props) {
    const { template } = props
    const [value, setValue] = useState(template);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement> | undefined) => {
        if (!event?.currentTarget) return;
        setValue(event.currentTarget.value)
    }

    console.log(value)
    return (
        <div className="w-200">
            <MDEditor height={400} value={template} onChange={() => { }} />

        </div>
    )
}