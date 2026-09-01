import { useEffect, useState } from "react";
import { Viz } from "@/types/types";
import { useVizHistory } from "@/lib/hooks";

interface Props {
  viz?: Viz | null;
  onSelectHistory?: (file: string) => void;
  onRevert?: (file: string) => void;
}

export default function VizVersionControl(props: Props) {
  const { viz, onSelectHistory, onRevert } = props;
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number | null>(null);
  const vizWithId = viz && viz.id !== undefined ? viz : undefined;
  const { data: history = [] } = useVizHistory(vizWithId);

  useEffect(() => {
    setSelectedHistoryIndex(null);
  }, [viz?.id]);

  return (
    <>
      <h3 className="text-xl">
        {viz ? `History (Viz ${viz.id})` : "History"}
      </h3>

      <div className="flex flex-col overflow-y-auto">
        {!viz ? (
          <p className="text-sm text-dvrpc-gray-3">No viz selected</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-dvrpc-gray-3">No history available</p>
        ) : (
          history.map((item, i) => {
            const isSelected = selectedHistoryIndex === i;
            return (
              <div
                key={i}
                className={`border-b border-dvrpc-gray-6 px-3 py-2 text-sm transition-all ${isSelected ? "bg-dvrpc-blue-6 shadow-inner ring-1 ring-dvrpc-blue-3" : "hover:bg-dvrpc-gray-6"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHistoryIndex(i);
                    onSelectHistory?.(item.file);
                  }}
                  className="block w-full text-left rounded px-2 py-1"
                >
                  {`${new Date(item.updated_at).toLocaleString()}${i == 0 ? " (Current)" : ""}`}
                  <br />
                  {`Edited by: ${item.last_edited_by}`}
                </button>
                {isSelected && i > 0 && onRevert && (
                  <button
                    type="button"
                    onClick={() => onRevert(item.file)}
                    className="mt-2 rounded bg-dvrpc-blue-3 px-2 py-1 text-xs font-medium text-white hover:bg-dvrpc-blue-2"
                  >
                    Revert to this version
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}