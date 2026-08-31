"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Button from "@/components/Buttons/Button";
import IconButton from "@/components/Buttons/IconButton";
import { GeoLevel, Viz, Visualization } from "@/types/types";
import {
  useCreateVisualization,
  useDeleteVisualization,
  useProfile,
  useUpdateVisualization,
  useVisualizations,
  useVizPreview,
} from "@/lib/hooks";
import { useAdminToast } from "../Toast/AdminToast";
import DeleteModal from "../Components/DeleteModal";
import VizModal from "./VizModal";
import VizPreview from "./VizPreview";
import VizVersionControl from "./VizVersionControl";

const defaultGeoids = {
  county: "42101",
  municipality: "4201704976",
};

interface Props {
  topicId: number;
  geoLevel: GeoLevel;
}

export default function VizTable({ topicId, geoLevel }: Props) {
  const { data: session } = useSession();
  const { data, isLoading } = useVisualizations(topicId);
  const { mutate: createMutation, status: createStatus } =
    useCreateVisualization();
  const { mutate: updateMutation, status: updateStatus } =
    useUpdateVisualization();
  const { mutate: deleteMutation, status: deleteStatus } =
    useDeleteVisualization();
  const { showToast, showError } = useAdminToast();

  const vizItems: Viz[] = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }, [data]);

  const changePending =
    createStatus === "pending" ||
    updateStatus === "pending" ||
    deleteStatus === "pending";

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Viz | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Viz | null>(null);

  useEffect(() => {
    setSelectedId(null);
    setShowModal(false);
    setEditing(null);
    setDeleteTarget(null);
  }, [topicId]);

  useEffect(() => {
    setSelectedId((current) => {
      if (current !== null && vizItems.some((viz) => viz.id === current)) {
        return current;
      }
      return vizItems[0]?.id ?? null;
    });
  }, [vizItems]);

  const selectedViz = vizItems?.find((viz) => viz.id === selectedId) ?? null;

  const selectedVisualization: Visualization | null = useMemo(() => {
    if (!selectedViz) return null;
    try {
      return JSON.parse(selectedViz.file) as Visualization;
    } catch {
      return null;
    }
  }, [selectedViz]);

  const previewGeoLevel = geoLevel;
  const previewGeoid =
    geoLevel === "region" ? undefined : defaultGeoids[geoLevel];

  const { data: profile } = useProfile(previewGeoLevel, previewGeoid);
  const { data: preview } = useVizPreview(
    selectedVisualization,
    previewGeoLevel,
    previewGeoid,
  );
  const previewVisualizations: Visualization[] = useMemo(
    () => (preview ? [preview] : []),
    [preview],
  );

  const handleOpenNew = () => {
    setEditing(null);
    setShowModal(true);
  };

  const handleOpenEdit = (viz: Viz) => {
    setEditing(viz);
    setShowModal(true);
  };

  const handleSave = (file: string, sortWeight: number, id?: number) => {
    const user = session?.user.name;
    if (!user) return;
    setShowModal(false);
    setEditing(null);

    if (!id) {
      createMutation(
        {
          viz: {
            file,
            topic_id: topicId,
            last_edited_by: user,
            sort_weight: sortWeight,
          },
        },
        {
          onSuccess: (newId) => {
            setSelectedId(newId);
            showToast(`Visualization (ID: ${newId}) created successfully.`);
          },
          onError: (error) =>
            showError(error, "Failed to create visualization"),
        },
      );
    } else {
      const nextPayload: { file?: string; sort_weight?: number; last_edited_by: string } = {
        last_edited_by: user,
      };

      if (file !== editing?.file) {
        nextPayload.file = file;
      }

      if (sortWeight !== editing?.sort_weight) {
        nextPayload.sort_weight = sortWeight;
      }

      updateMutation(
        { id, viz: nextPayload },
        {
          onSuccess: () => {
            setSelectedId(id);
            showToast(`Visualization (ID: ${id}) saved successfully.`);
          },
          onError: (error) =>
            showError(error, `Failed to save visualization (ID: ${id})`),
        },
      );
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    deleteMutation(id, {
      onSuccess: () => {
        setSelectedId((current) => (current === id ? null : current));
        showToast(`Visualization (ID: ${id}) deleted successfully.`);
      },
      onError: (error) =>
        showError(error, `Failed to delete visualization (ID: ${id})`),
    });
    setDeleteTarget(null);
  };

  return (
    <div className="p-4 h-full overflow-auto flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Visualizations
          </h1>
          {(isLoading || changePending) && (
            <Loader2 className="animate-spin text-dvrpc-blue-3" size={32} />
          )}
        </div>
        <Button
          disabled={topicId === 0}
          handleClick={handleOpenNew}
          type="primary"
        >
          <Plus size={18} /> Add Visualization
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-dvrpc-gray-5 p-12">
          <Loader2 className="animate-spin text-dvrpc-blue-3" size={32} />
          <p className="text-dvrpc-gray-3">Loading visualizations...</p>
        </div>
      ) : vizItems.length === 0 ? (
        topicId === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-dvrpc-gray-5 p-12">
            <p className="text-dvrpc-gray-3">
              Select a topic from the sidebar to view its visualizations.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-dvrpc-gray-5 p-12">
            <p className="text-dvrpc-gray-3">
              No visualizations for this topic yet.
            </p>
            <Button handleClick={handleOpenNew} type="primary">
              <Plus size={18} /> Create your first visualization
            </Button>
          </div>
        )
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-dvrpc-gray-7 text-left text-xs uppercase tracking-wide">
              <tr>
                <th className="py-2 px-3">Visualization</th>
                <th className="py-2 px-3">Last updated</th>
                <th className="py-2 px-3">Last edited by</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vizItems.map((viz, index) => {
                const isSelected = viz.id === selectedId;
                return (
                  <tr
                    key={viz.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(viz.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedId(viz.id);
                      }
                    }}
                    className={`border-b cursor-pointer transition-all ${isSelected ? "bg-dvrpc-blue-6 shadow-inner ring-1 ring-dvrpc-blue-3" : "bg-white hover:bg-gray-50"}`}
                  >
                    <td className="py-2 px-3 font-medium">
                      <div className="flex items-center gap-2">
                        <span>Viz {index + 1}</span>
                        {isSelected && (
                          <span className="rounded-full bg-dvrpc-blue-3 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Selected
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-dvrpc-gray-3">
                      {viz.updated_at
                        ? new Date(viz.updated_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-2 px-3 text-dvrpc-gray-3">
                      {viz.last_edited_by ?? "—"}
                    </td>
                    <td
                      className="py-2 px-3 text-center"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <IconButton
                          handleClick={() => handleOpenEdit(viz)}
                          description="Edit Visualization"
                          icon={
                            <Pencil size={16} className="text-dvrpc-blue-3" />
                          }
                        />
                        <IconButton
                          handleClick={() => setDeleteTarget(viz)}
                          description="Delete Visualization"
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
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-md border border-dvrpc-gray-6 p-3 flex flex-col gap-2">
          <h3 className="text-xl">Preview</h3>
          {selectedViz && profile && previewVisualizations.length > 0 ? (
            <VizPreview
              visualizations={previewVisualizations}
              buffer_bbox={profile.geography.buffer_bbox}
              geoLevel={previewGeoLevel}
              geoid={profile.geography.geoid}
            />
          ) : (
            <p className="text-gray-400 italic">No preview available.</p>
          )}
        </div>
        <div className="rounded-md border border-dvrpc-gray-6 p-3">
          <VizVersionControl viz={selectedViz} />
        </div>
      </div>

      {showModal && (
        <VizModal
          initialData={editing}
          onCancel={() => {
            setShowModal(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
      <DeleteModal
        open={deleteTarget !== null}
        paragraphs={["Are you sure you want to delete this visualization?"]}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}