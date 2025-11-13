import { useState } from "react";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import SourceModal from "./SourceModal";
import { Source, SourceForm } from "@/types/types";
import Button from "@/components/Buttons/Button";
import IconButton from "@/components/Buttons/IconButton";
import {
  useCreateSource,
  useDeleteSource,
  useSource,
  useUpdateSource,
} from "@/lib/hooks";

export default function SourceManager() {
  const { data: sources, isLoading } = useSource();
  const { mutate: createMutation, status: createStatus } = useCreateSource();
  const { mutate: updateMutation, status: updateStatus } = useUpdateSource();
  const { mutate: deleteMutation, status: deleteStatus } = useDeleteSource();

  const changePending =
    createStatus == "pending" ||
    updateStatus == "pending" ||
    deleteStatus == "pending";

  const [editing, setEditing] = useState<Source | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (!sources) return <></>;

  const handleSave = (source: SourceForm) => {
    console.log(source);
    if (!source.id) {
      createMutation(source);
    } else {
      const { id, ...sourceBody } = source;
      updateMutation({ id: source.id, source: sourceBody });
    }

    setEditing(null);
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    deleteMutation(id);
  };

  const handleEdit = (source: Source) => {
    setEditing(source);
    setShowModal(true);
  };

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">Sources</h1>
            {(isLoading || changePending) && (
              // ⬅️ Loading Spinner
              <div>
                <Loader2 className="animate-spin text-dvrpc-blue-3" size={32} />
              </div>
            )}
          </div>
          <Button
            handleClick={() => {
              setEditing(null);
              setShowModal(true);
            }}
            type={"primary"}
          >
            <Plus size={18} /> Add Source
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-dvrpc-gray-7 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Year From</th>
                <th className="p-3">Year To</th>
                <th className="p-3">Citation</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr
                  key={source.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{source.name}</td>
                  <td className="p-3">{source.year_from ?? "—"}</td>
                  <td className="p-3">{source.year_to ?? "—"}</td>
                  <td className="p-3 text-sm text-dvrpc-gray-2">
                    {source.citation}
                  </td>
                  <td className="p-3 text-center">
                    <IconButton
                      handleClick={() => handleEdit(source)}
                      description="Edit Source"
                      icon={<Pencil size={18} className="text-dvrpc-blue-3" />} // className="inline-flex items-center text-blue-600 hover:text-blue-800 mr-3"
                    />
                    <IconButton
                      handleClick={() => handleDelete(source.id)}
                      description="Edit Source"
                      icon={<Trash2 size={18} color="red" />} // className="inline-flex items-center text-blue-600 hover:text-blue-800 mr-3"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <SourceModal
          initialData={editing}
          onCancel={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
