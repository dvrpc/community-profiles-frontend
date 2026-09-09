import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { JsonEditor, JsonData } from "json-edit-react";
import Button from "@/components/Buttons/Button";
import MultiSelect from "../Form/MultiSelect";
import VizPreview from "./VizPreview";
import { GeoLevel, SelectOption, VizFile, Viz } from "@/types/types";
import { useProfile, useSource, useVizPreview } from "@/lib/hooks";

interface Props {
  initialData: Viz | null;
  geoLevel: GeoLevel;
  geoid?: string;
  onCancel: () => void;
  onSave: (
    file: string,
    sortWeight: number,
    sourceIds: number[],
    id?: number,
  ) => void;
}

const emptyTemplate = {};
const defaultGeoids = {
  county: "42101",
  municipality: "4201704976",
};

export default function VizModal({
  initialData,
  geoLevel,
  geoid,
  onCancel,
  onSave,
}: Props) {
  const [data, setData] = useState<JsonData>(() => {
    if (initialData) {
      return initialData.file;
    }
    return emptyTemplate;
  });
  const [sortWeight, setSortWeight] = useState<number>(
    initialData?.sort_weight ?? 0,
  );
  const { data: sources } = useSource();
  const sourceOptions =
    sources?.map((source) => ({
      value: source.id,
      label: source.citation,
    })) ?? [];
  const selectedSourceOptions = sourceOptions.filter((source) =>
    initialData?.source_ids?.includes(Number(source.value)),
  );
  const [selectedSources, setSelectedSources] = useState<SelectOption[]>(
    selectedSourceOptions,
  );
  const [error, setError] = useState<string>("");

  const previewGeoLevel = geoLevel;
  const previewGeoid =
    geoLevel === "region" ? undefined : (geoid ?? defaultGeoids[geoLevel]);

  const previewPayload = useMemo<VizFile | null>(() => {
    if (!data || typeof data !== "object") return null;

    const vizPreview = JSON.parse(JSON.stringify(data)) as Partial<VizFile>;
    if (
      vizPreview &&
      typeof vizPreview === "object" &&
      (vizPreview.type === "map" || vizPreview.type === "chart")
    ) {
      return vizPreview as VizFile;
    }

    return vizPreview as VizFile;
  }, [data]);

  const { data: profile } = useProfile(previewGeoLevel, previewGeoid);
  const { data: preview, isLoading: previewLoading } = useVizPreview(
    previewPayload,
    previewGeoLevel,
    previewGeoid,
  );

  const handleSave = () => {
    try {
      onSave(
        JSON.stringify(data),
        sortWeight,
        selectedSources.map((source) => Number(source.value)),
        initialData?.id,
      );
    } catch {
      setError("Unable to save. The visualization JSON is invalid.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto p-6">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Visualization" : "New Visualization"}
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="mb-4 flex flex-col gap-1">
          <label className="font-medium text-sm text-gray-700">
            Sort Weight
          </label>
          <input
            type="number"
            value={sortWeight}
            onChange={(e) => setSortWeight(Number(e.target.value) || 0)}
            className="border border-dvrpc-gray-5 p-2 rounded-md"
          />
        </div>

        <div className="mb-4 flex flex-col gap-1">
          <label className="font-medium text-sm text-gray-700">Sources</label>
          <MultiSelect
            value={selectedSources}
            options={sourceOptions}
            onChange={(values) => setSelectedSources([...values])}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch">
          <div className="max-h-[60vh] overflow-auto rounded-md border border-dvrpc-gray-6 p-2">
            <JsonEditor
              rootFontSize={12}
              maxWidth="100%"
              data={data}
              setData={(next) => setData(next)}
            />
          </div>

          <div className="rounded-md border border-dvrpc-gray-6 p-3 min-h-[280px] flex flex-col">
            <h3 className="text-lg font-medium mb-3">Live Preview</h3>
            {previewLoading ? (
              <div className="flex flex-1 items-center justify-center gap-2 text-dvrpc-gray-3">
                <Loader2 className="animate-spin" size={20} />
                <span>Loading preview...</span>
              </div>
            ) : profile && preview ? (
              <VizPreview
                id={initialData?.id}
                visualization={preview}
                buffer_bbox={profile.geography.buffer_bbox}
                geoLevel={previewGeoLevel}
                geoid={profile.geography.geoid}
              />
            ) : (
              <p className="text-gray-400 italic">No preview available.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button handleClick={onCancel} type="secondary">
            Cancel
          </Button>
          <Button handleClick={handleSave} type="primary">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
