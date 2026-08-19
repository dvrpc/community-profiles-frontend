import { JsonEditor } from "json-edit-react";
import { useEffect, useState } from "react";
import { useSource } from "@/lib/hooks";
import { SelectOption, Visualization } from "@/types/types";
import MultiSelect from "../Form/MultiSelect";
import Button from "@/components/Buttons/Button";

interface Props {
  visualizations: Visualization[];
  handleChange: (value: Visualization[]) => void;
  sourceIds: number[];
  sourceResetKey: string;
  handleSourcesChange: (sourceIds: number[]) => void;
}
export default function VizEditor(props: Props) {
  const {
    visualizations,
    handleChange,
    sourceIds,
    sourceResetKey,
    handleSourcesChange,
  } = props;
  const { data: sources } = useSource();
  const [sourcesByVisualization, setSourcesByVisualization] = useState<
    number[][]
  >([]);

  useEffect(() => {
    setSourcesByVisualization(visualizations.map(() => sourceIds));
  }, [sourceResetKey]); // Reset only when a different saved visualization is loaded.

  const updateSources = (index: number, ids: number[]) => {
    const next = sourcesByVisualization.map((current, currentIndex) =>
      currentIndex === index ? ids : current,
    );
    setSourcesByVisualization(next);
    handleSourcesChange([...new Set(next.flat())]);
  };

  const updateVisualization = (index: number, data: unknown) => {
    const next = [...visualizations];
    next[index] = data as Visualization;
    handleChange(next);
  };

  const addVisualization = () => {
    handleChange([...visualizations, {} as Visualization]);
    setSourcesByVisualization((current) => [...current, []]);
  };

  const removeVisualization = (index: number) => {
    const nextSources = sourcesByVisualization.filter(
      (_, currentIndex) => currentIndex !== index,
    );
    handleChange(visualizations.filter((_, currentIndex) => currentIndex !== index));
    setSourcesByVisualization(nextSources);
    handleSourcesChange([...new Set(nextSources.flat())]);
  };

  const sourceOptions: SelectOption[] = (sources ?? []).map((source) => ({
    value: source.id,
    label: source.citation,
  }));

  return (
    <div className="flex flex-col gap-6">
      {visualizations.map((visualization, index) => {
        const selectedSources: SelectOption[] = (sourcesByVisualization[index] ?? [])
          .map((id) => sourceOptions.find((source) => source.value === id))
          .filter(Boolean) as SelectOption[];

        return (
          <section
            className="rounded border border-dvrpc-gray-5 p-3"
            key={index}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="font-medium">Visualization {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeVisualization(index)}
                className="text-sm text-red-700 hover:underline"
              >
                Remove
              </button>
            </div>
            <JsonEditor
              rootFontSize={12}
              maxWidth={"100%"}
              data={visualization}
              setData={(data) => updateVisualization(index, data)}
            />
            <div className="mt-4 flex flex-col gap-1">
              <label className="font-medium">Visualization Sources</label>
              <MultiSelect
                value={selectedSources}
                options={sourceOptions}
                onChange={(values) =>
                  updateSources(index, values.map((source) => Number(source.value)))
                }
              />
            </div>
          </section>
        );
      })}
      <div>
        <Button type="secondary" handleClick={addVisualization}>
          Add visualization
        </Button>
      </div>
    </div>
  );
}
