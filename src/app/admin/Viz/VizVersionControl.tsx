import { Viz } from "@/types/types";
import { useVizHistory } from "@/lib/hooks";

interface Props {
  viz?: Viz | null;
}

export default function VizVersionControl(props: Props) {
  const { viz } = props;
  const vizWithId = viz && viz.id !== undefined ? viz : undefined;
  const { data: history = [] } = useVizHistory(vizWithId);

  return (
    <>
      <h3 className="text-xl">History</h3>

      <div className="flex flex-col overflow-y-auto">
        {!viz ? (
          <p className="text-sm text-dvrpc-gray-3">No viz selected</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-dvrpc-gray-3">No history available</p>
        ) : (
          history.map((item, i) => (
            <div
              key={i}
              className="text-left px-4 py-2 text-sm hover:bg-dvrpc-gray-6 transition"
            >
              {`${new Date(item.updated_at).toLocaleString()}${i == 0 ? " (Current)" : ""}`}
              <br />
              {`Edited by: ${item.last_edited_by}`}
            </div>
          ))
        )}
      </div>
    </>
  );
}