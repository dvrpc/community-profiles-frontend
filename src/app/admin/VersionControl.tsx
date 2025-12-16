import { Content } from "@/types/types";

interface Props {
  contentHistory: Content[];
  handleClick: (file: string, index: number) => void;
}

export default function VersionControl(props: Props) {
  const { contentHistory, handleClick } = props;
  return (
    <>
      <h3 className="text-dvrpc-blue-1 text-2xl font-semibold p-4 border-b border-dvrpc-gray-6">
        History
      </h3>

      <div className="flex flex-col overflow-y-auto">
        {contentHistory.length === 0 ? (
          <p className="text-sm text-dvrpc-gray-3 p-4">No history available</p>
        ) : (
          contentHistory.map((item, i) => (
            <button
              key={i}
              onClick={() => handleClick(item.file, i)}
              className="text-left px-4 py-2 text-sm hover:bg-dvrpc-gray-6 focus:bg-dvrpc-gray-6 transition"
            >
              {`${new Date(item.create_date).toLocaleString()}${
                i == 0 ? " (Current)" : ""
              }`}
              <br />
              {`Edited by: ${item.last_edited_by}`}
            </button>
          ))
        )}
      </div>
    </>
  );
}
