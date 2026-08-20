import Button from "@/components/Buttons/Button";
import { useState } from "react";

interface Props {
  type: "subcategory" | "topic";
  parentLabel: string;
  onSave: (label: string, urlId: string, sortWeight: number) => void;
  onCancel: () => void;
}

function createUrlId(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CreateModal({
  type,
  parentLabel,
  onSave,
  onCancel,
}: Props) {
  const [label, setLabel] = useState("");
  const [urlId, setUrlId] = useState("");
  const [urlIdEdited, setUrlIdEdited] = useState(false);
  const [sortWeight, setSortWeight] = useState<number | "">(0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
  };

  const handleSave = () => {
    const trimmedLabel = label.trim();
    const trimmedUrlId = urlId.trim();
    if (canSave) {
      onSave(trimmedLabel, trimmedUrlId, sortWeight);
    }
  };

  const canSave =
    label.trim().length > 0 &&
    urlId.trim().length > 0 &&
    sortWeight !== "" &&
    Number.isFinite(sortWeight);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          New {type} under {parentLabel}
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="new-label">
              Label <span className="text-red-600">*</span>
            </label>
            <input
              id="new-label"
              autoFocus
              required
              value={label}
              onChange={(event) => {
                const nextLabel = event.target.value;
                setLabel(nextLabel);
                if (!urlIdEdited) setUrlId(createUrlId(nextLabel));
              }}
              className="border border-dvrpc-gray-5 p-2 rounded"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="new-url-id">
              URL ID <span className="text-red-600">*</span>
            </label>
            <input
              id="new-url-id"
              type="text"
              required
              value={urlId}
              onChange={(event) => {
                setUrlIdEdited(true);
                setUrlId(event.target.value);
              }}
              className="border border-dvrpc-gray-5 p-2 rounded"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="new-sort-weight">
              Sort Weight <span className="text-red-600">*</span>
            </label>
            <input
              id="new-sort-weight"
              type="number"
              required
              value={sortWeight}
              onChange={(event) =>
                setSortWeight(
                  event.target.value === "" ? "" : Number(event.target.value),
                )
              }
              className="border border-dvrpc-gray-5 p-2 rounded"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button handleClick={onCancel} type="secondary">
              Cancel
            </Button>
            <Button type="primary" disabled={!canSave} handleClick={handleSave}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
