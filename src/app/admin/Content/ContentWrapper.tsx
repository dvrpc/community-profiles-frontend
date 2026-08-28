"use client";

import Button from "@/components/Buttons/Button";
import { useContentPreview } from "@/lib/hooks";
import { useEffect } from "react";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownPreview from "./MarkdownPreview";
import VersionControl from "./VersionControl";
import { Content, GeoLevel } from "@/types/types";

interface Props {
  value: string;
  content: Content;
  hasEdits: boolean;
  geoLevel: GeoLevel;
  isPending: boolean;
  geoid: string | undefined;
  setValue: (value: string) => void;
  handleSave: () => void
  setHasEdits: (hasEdits: boolean) => void;
  handleVersionChange: (file: string, index: number) => void;
}

export default function ContentWrapper({
  value,
  content,
  hasEdits,
  geoLevel,
  isPending,
  geoid,
  setValue,
  handleSave,
  setHasEdits,
  handleVersionChange,
}: Props) {

  const { data: preview } = useContentPreview(value, geoLevel, geoid);

  useEffect(() => {
    if (content) {
      setValue(content.file);
      setHasEdits(false);
    }
  }, [content]);

  if (!content) return <p>Loading content...</p>;

  return (
    <>
      <div className="col-start-2 row-start-2 row-span-2 overflow-auto rounded-md bg-white p-2">
        <h3 className="mb-2 p-2 text-xl">Editor</h3>
        <MarkdownEditor
          value={value}
          handleChange={(nextValue) => {
            setValue(nextValue);
            setHasEdits(true);
          }}
        />
      </div>
      <div className="col-start-3 row-start-2 row-span-2 overflow-auto rounded-md bg-white p-2">
        <div className="mb-2 flex justify-between p-2">
          <h3 className="text-xl">Preview</h3>
          <Button
            disabled={!hasEdits || isPending}
            handleClick={handleSave}
            type="primary"
          >
            {isPending ? "Saving..." : "Save Content"}
          </Button>
        </div>
        <MarkdownPreview content={preview ? preview : ""} />
      </div>
      <div className="col-start-4 row-start-2 row-span-2 overflow-auto rounded-md bg-white">
        <VersionControl
          content={content}
          handleClick={handleVersionChange}
        />
      </div>
    </>
  );
}
