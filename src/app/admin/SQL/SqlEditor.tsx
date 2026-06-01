import { useState } from "react";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import DeleteModal from "../Components/DeleteModal";
import { Sql, SqlForm, Variable, VariableForm } from "@/types/types";
import Button from "@/components/Buttons/Button";
import IconButton from "@/components/Buttons/IconButton";
import {
  useCreateVariable,
  useUpdateVariable,
  useDeleteVariable,
  useVariable,
  useCreateSql,
  useUpdateSql,
  useDeleteSql,
  useSql,
} from "@/lib/hooks";
import BuildStatus from "../Build/BuildStatus";
import SqlModal from "./SqlModal";

export default function SqlEditor() {
  const { data: sqlQueries, isLoading } = useSql();
  const { mutate: createMutation, status: createStatus } = useCreateSql();
  const { mutate: updateMutation, status: updateStatus } = useUpdateSql();
  const { mutate: deleteMutation, status: deleteStatus } = useDeleteSql();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name?: string;
  } | null>(null);

  const changePending =
    createStatus == "pending" ||
    updateStatus == "pending" ||
    deleteStatus == "pending";

  const [editing, setEditing] = useState<Sql | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (!sqlQueries) return <></>;

  const handleSave = (sql: SqlForm) => {
    if (!sql.id) {
      createMutation(sql);
    } else {
      const { id, ...sqlApiBody } = sql;
      updateMutation({ id: sql.id, sql: sqlApiBody });
    }

    setEditing(null);
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setDeleteTarget({ id, name: sqlQueries?.find((s) => s.id === id)?.name });
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation(deleteTarget.id);
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const handleEdit = (sql: Sql) => {
    setEditing(sql);
    setShowModal(true);
  };

  return (
    <>
      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              SQL Queries
            </h1>
            {(isLoading || changePending) && (
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
            <Plus size={18} /> Add SQL Query
          </Button>
        </div>


        <div className="overflow-y-auto flex-1 min-h-0">
          <table className="min-w-[960px] w-full border-collapse text-sm">
            <thead className="sticyk top-0 z-10">
              <tr className="bg-dvrpc-gray-7 text-left text-xs uppercase tracking-wide">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Data Source</th>
                <th className="py-2 px-3">Geo Level</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sqlQueries.map((sql) => {
                return (
                  <tr
                    key={sql.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-2 px-3">{sql.name}</td>
                    <td className="py-2 px-3">{sql.data_source}</td>
                    <td className="py-2 px-3 uppercase">{sql.geo_level}</td>

                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <IconButton
                          handleClick={() => handleEdit(sql)}
                          description="Edit SQL Query"
                          icon={
                            <Pencil size={16} className="text-dvrpc-blue-3" />
                          }
                        />
                        <IconButton
                          handleClick={() => handleDelete(sql.id)}
                          description="Delete SQL Query"
                          icon={<Trash2 size={16} color="red" />}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <SqlModal
          initialData={editing}
          onCancel={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
      <DeleteModal
        open={deleteOpen}
        paragraphs={[
          `Are you sure you want to delete this sql query: "${deleteTarget?.name}"?`,
        ]}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}
