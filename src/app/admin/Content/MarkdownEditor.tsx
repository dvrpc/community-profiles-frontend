"use client";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

interface Props {
  value: string;
  handleChange: (value: string) => void;
}

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function MarkdownEditor(props: Props) {
  const { value, handleChange } = props;

  const onChange = (
    value?: string,
    event?: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (!event?.currentTarget || !value) return;
    handleChange(value);
  };

  return (
    <MDEditor height="100%" value={value} onChange={onChange} preview="edit" />
  );
}
