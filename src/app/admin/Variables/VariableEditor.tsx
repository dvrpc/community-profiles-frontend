import { useState } from "react";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import VariableModal from "./VariableModal";
import DeleteModal from "../Components/DeleteModal";
import BuildStatus from "./BuildStatus";
import { Variable, VariableForm } from "@/types/types";
import Button from "@/components/Buttons/Button";
import IconButton from "@/components/Buttons/IconButton";
import {
  useCreateVariable,
  useUpdateVariable,
  useDeleteVariable,
  useVariable,
} from "@/lib/hooks";

export default function VariableManager() {
  const { data: variables, isLoading } = useVariable();
  const { mutate: createMutation, status: createStatus } = useCreateVariable();
  const { mutate: updateMutation, status: updateStatus } = useUpdateVariable();
  const { mutate: deleteMutation, status: deleteStatus } = useDeleteVariable();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name?: string;
  } | null>(null);

  const changePending =
    createStatus == "pending" ||
    updateStatus == "pending" ||
    deleteStatus == "pending";

  const [editing, setEditing] = useState<Variable | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "category" | "data_source">(
    "name",
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedVariables = [...(variables ?? [])].sort((a, b) => {
    const aValue = a[sortBy]?.toString().toLowerCase() ?? "";
    const bValue = b[sortBy]?.toString().toLowerCase() ?? "";

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: "name" | "category" | "data_source") => {
    if (sortBy === key) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  if (!variables) return <></>;

  const handleSave = (variable: VariableForm) => {
    if (!variable.id) {
      createMutation(variable);
    } else {
      const { id, ...variableBody } = variable;
      updateMutation({ id: variable.id, variable: variableBody });
    }

    setEditing(null);
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    // show confirmation modal
    setDeleteTarget({ id, name: variables?.find((v) => v.id === id)?.name });
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation(deleteTarget.id);
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const handleEdit = (variable: Variable) => {
    setEditing(variable);
    setShowModal(true);
  };

  return (
    <>
      <div className="p-4 overflow-auto h-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">Variables</h1>
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
            <Plus size={18} /> Add ACS Variable
          </Button>
        </div>

        <BuildStatus />

        <div className="overflow-x-auto max-w-full">
          <table className="min-w-[960px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-dvrpc-gray-7 text-left text-xs uppercase tracking-wide">
                <th className="py-2 px-3">
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() => handleSort("name")}
                  >
                    Name
                    {sortBy === "name" && (sortDirection === "asc" ? "▲" : "▼")}
                  </button>
                </th>
                <th className="py-2 px-3">
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() => handleSort("category")}
                  >
                    Category
                    {sortBy === "category" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </button>
                </th>
                <th className="py-2 px-3">
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() => handleSort("data_source")}
                  >
                    Source
                    {sortBy === "data_source" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </button>
                </th>
                <th className="py-2 px-3">ACS Variable</th>
                <th className="py-2 px-3">GIS Table</th>
                <th className="py-2 px-3">Catalog Table</th>
                <th className="py-2 px-3">Year</th>
                <th className="py-2 px-3">Aggregateable</th>
                <th className="py-2 px-3">Last Updated</th>

                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedVariables.map((variable) => {
                const isEditable = variable.data_source === "acs";
                const lastUpdated = variable.last_updated
                  ? new Date(variable.last_updated).toLocaleDateString()
                  : "—";
                console.log(variable);
                return (
                  <tr
                    key={variable.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-2 px-3">{variable.name}</td>
                    <td className="py-2 px-3">{variable.category}</td>
                    <td className="py-2 px-3 uppercase">
                      {variable.data_source}
                    </td>
                    <td className="py-2 px-3">
                      {variable.acs_variable ?? "—"}
                    </td>
                    <td className="py-2 px-3">{variable.gis_table ?? "—"}</td>
                    <td className="py-2 px-3">
                      {variable.catalog_table ?? "—"}
                    </td>

                    <td className="py-2 px-3">{variable.data_year ?? "—"}</td>
                    <td className="py-2 px-3">
                      {variable.aggregateable !== undefined
                        ? variable.aggregateable
                          ? "Yes"
                          : "No"
                        : "—"}
                    </td>
                    <td className="py-2 px-3">{lastUpdated}</td>
                    <td className="py-2 px-3 text-center">
                      {isEditable ? (
                        <div className="flex items-center justify-center gap-2">
                          <IconButton
                            handleClick={() => handleEdit(variable)}
                            description="Edit Variable"
                            icon={
                              <Pencil size={16} className="text-dvrpc-blue-3" />
                            }
                          />
                          <IconButton
                            handleClick={() => handleDelete(variable.id)}
                            description="Delete Variable"
                            icon={<Trash2 size={16} color="red" />}
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-dvrpc-gray-2">
                          View only
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <VariableModal
          initialData={editing}
          onCancel={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
      <DeleteModal
        open={deleteOpen}
        paragraphs={[
          `Are you sure you want to delete this variable: "${deleteTarget?.name}"?`,
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
