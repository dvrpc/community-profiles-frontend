"use client";

import Button from "@/components/Buttons/Button";
import { useContentPreview, useUpdateContent } from "@/lib/hooks";
import { useSession } from "next-auth/react";
import { useAdminToast } from "../Toast/AdminToast";
import { useEffect, useState } from "react";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownPreview from "./MarkdownPreview";
import { Content, GeoLevel } from "@/types/types";

interface Props {
  content: Content;
  hasEdits: boolean;
  geoLevel: GeoLevel;
  geoid: string | undefined;
  setHasEdits: (hasEdits: boolean) => void;
}

export default function ContentWrapper({
  content,
  hasEdits,
  geoLevel,
  geoid,
  setHasEdits,
}: Props) {
  const [value, setValue] = useState("");
  const updateContentMutation = useUpdateContent();
  const { data: preview } = useContentPreview(value, geoLevel, geoid);
  const { data: session } = useSession();
  const { showToast, showError } = useAdminToast();

  console.log(geoLevel, geoid);
  useEffect(() => {
    if (content) {
      setValue(content.file);
      setHasEdits(false);
    }
  }, [content]);

  const handleSave = () => {
    const user = session?.user.name;
    if (!user || !content) return;

    updateContentMutation.mutate(
      { id: content.id, payload: { file: value, last_edited_by: user } },
      {
        onSuccess: () => {
          setHasEdits(false);
          showToast(`Content (ID: ${content.id}) saved successfully.`);
        },
        onError: (err) =>
          showError(err, `Failed to save content (ID: ${content.id})`),
      },
    );
  };

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
            disabled={!hasEdits || updateContentMutation.isPending}
            handleClick={handleSave}
            type="primary"
          >
            {updateContentMutation.isPending ? "Saving..." : "Save Content"}
          </Button>
        </div>
        <MarkdownPreview content={preview ? preview : ""} />
      </div>
    </>
  );
}
