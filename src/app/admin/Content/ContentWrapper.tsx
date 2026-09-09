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
      <div className="col-start-2 row-start-2 min-h-0 overflow-auto rounded-xl border border-dvrpc-gray-6 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-dvrpc-gray-1">Editor</h3>
        <MarkdownEditor
          value={value}
          handleChange={(nextValue) => {
            setValue(nextValue);
            setHasEdits(true);
          }}
        />
      </div>
      <div className="col-start-3 row-start-2 min-h-0 overflow-auto rounded-xl border border-dvrpc-gray-6 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dvrpc-gray-1">Preview</h3>
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
      <div className="col-start-4 row-start-2 min-h-0 overflow-auto rounded-xl border border-dvrpc-gray-6 bg-white shadow-sm">
        <VersionControl
          content={content}
          handleClick={handleVersionChange}
        />
      </div>
    </>
  );
}
