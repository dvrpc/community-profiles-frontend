"use client";

import Button from "@/components/Buttons/Button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GeoLevel, Visualization } from "@/types/types";
import {
  useVizPreview,
  useProfile,
  useSave,
  useUpdateProperties,
  useViz,
} from "@/lib/hooks";
import { useAdminToast } from "../Toast/AdminToast";
import VizEditor from "./VizEditor";
import VizPreview from "./VizPreview";

interface Props {
  topic_id: number;
}

const defaultGeoids = {
  county: "42101",
  municipality: "4201704976",
};

export default function VizWrapper({ topic_id }: Props) {
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [sourceIds, setSourceIds] = useState<number[]>([]);
  const [hasEdits, setHasEdits] = useState(false);
  const { data: viz } = useViz(topic_id);
  const { data: session } = useSession();
  const { showToast, showError } = useAdminToast();
  const saveMutation = useSave();
  const propertiesMutation = useUpdateProperties();

  const geoLevel = (viz?.geo_level ?? "region") as GeoLevel;
  const geoid = geoLevel === "region" ? undefined : defaultGeoids[geoLevel];
  const { data: profile } = useProfile(geoLevel, geoid);

  useEffect(() => {
    if (viz) {
      setVisualizations(JSON.parse(viz.file));
      setSourceIds(viz.source_ids);
      setHasEdits(false);
    }
  }, [viz]);

  const { data: preview } = useVizPreview(visualizations, geoLevel, geoid);

  const handleSave = () => {
    const user = session?.user.name;
    if (!user || !viz) return;

    saveMutation.mutate(
      {
        url: `/viz/${viz_id}`,
        body: { user, text: JSON.stringify(visualizations) },
      },
      {
        onSuccess: () => {
          setHasEdits(false);
          showToast(`Visualizations (ID: ${viz_id}) saved successfully.`);
        },
        onError: (error) =>
          showError(error, `Failed to save visualizations (ID: ${viz_id})`),
      },
    );

    propertiesMutation.mutate(
      { id: viz.id, payload: { viz_sources: sourceIds } },
      {
        onSuccess: () =>
          showToast(
            `Visualization sources saved successfully (ID: ${viz.id}).`,
          ),
        onError: (error) =>
          showError(
            error,
            `Failed to save visualization sources (ID: ${viz.id})`,
          ),
      },
    );
  };

  if (!viz) return <p>Loading visualizations...</p>;

  return (
    <>
      <div className="col-start-2 row-start-2 row-span-2 overflow-auto rounded-md bg-white p-2">
        <h3 className="mb-2 p-2 text-xl">Editor</h3>
        <VizEditor
          visualizations={visualizations}
          handleChange={(nextValue) => {
            setVisualizations(nextValue);
            setHasEdits(true);
          }}
          sourceIds={sourceIds}
          sourceResetKey={`${viz.id}:${viz.file}`}
          handleSourcesChange={(nextIds) => {
            setSourceIds(nextIds);
            setHasEdits(true);
          }}
        />
      </div>
      <div className="col-start-3 row-start-2 row-span-2 overflow-auto rounded-md bg-white p-2">
        <div className="mb-2 flex justify-between p-2">
          <h3 className="text-xl">Preview</h3>
          <Button
            disabled={!hasEdits || saveMutation.isPending}
            handleClick={handleSave}
            type="primary"
          >
            {saveMutation.isPending ? "Saving..." : "Save Visualizations"}
          </Button>
        </div>
        {preview && profile ? (
          <VizPreview
            visualizations={preview}
            buffer_bbox={profile.geography.buffer_bbox}
            geoLevel={geoLevel}
            geoid={profile.geography.geoid}
          />
        ) : (
          <p className="text-gray-400 italic">Loading preview...</p>
        )}
      </div>
    </>
  );
}
