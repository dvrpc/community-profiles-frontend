import { useState } from "react";
import { JsonEditor, JsonData } from "json-edit-react";
import Button from "@/components/Buttons/Button";
import { Viz } from "@/types/types";

interface Props {
  initialData: Viz | null;
  onCancel: () => void;
  onSave: (file: string, id?: number) => void;
}

const emptyTemplate = [{}];

export default function VizModal({ initialData, onCancel, onSave }: Props) {
  const [data, setData] = useState<JsonData>(() => {
    if (initialData) {
      try {
        return JSON.parse(initialData.file);
      } catch {
        return emptyTemplate;
      }
    }
    return emptyTemplate;
  });
  const [error, setError] = useState<string>("");

  const handleSave = () => {
    try {
      onSave(JSON.stringify(data), initialData?.id);
    } catch {
      setError("Unable to save. The visualization JSON is invalid.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-auto p-6">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Visualization" : "New Visualization"}
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <JsonEditor
          rootFontSize={12}
          maxWidth="100%"
          data={data}
          setData={(next) => setData(next)}
        />
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