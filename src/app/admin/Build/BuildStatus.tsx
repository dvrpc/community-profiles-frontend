// components/BuildStatus.tsx
import { useState } from "react";
import { Loader2, Hammer } from "lucide-react";
import Button from "@/components/Buttons/Button";
import { useBuildStatus, useTriggerBuild } from "@/lib/hooks";

const buildCategories = ["acs", "gis", "ckan", "all"] as const;
type BuildCategory = (typeof buildCategories)[number];

export default function BuildStatus() {
  const { data: status } = useBuildStatus();
  const { mutate: triggerBuild, isPending } = useTriggerBuild();
  const [pendingCategory, setPendingCategory] = useState<BuildCategory | null>(
    null,
  );

  const isBuilding = status?.is_building ?? false;
  const closeConfirmation = () => setPendingCategory(null);

  function confirmBuild() {
    if (!pendingCategory) return;

    triggerBuild(
      { category: pendingCategory },
      { onSuccess: closeConfirmation },
    );
  }

  return (
    <div className=" p-4 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-sm">
        {isBuilding ? (
          <>
            <Loader2 className="animate-spin text-dvrpc-blue-3" size={16} />
            <span>
              Building <span className="font-medium">{status?.category}</span>
              ...
            </span>
          </>
        ) : (
          <span className="text-dvrpc-gray-2">
            Last built:{" "}
            {status?.finished_at
              ? new Date(status.finished_at).toLocaleString()
              : "—"}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {buildCategories.map((category) => (
          <Button
            key={category}
            type="primary"
            disabled={isBuilding || isPending || category === "ckan"}
            handleClick={() => setPendingCategory(category)}
          >
            <Hammer size={18} />
            {category.toUpperCase()}
          </Button>
        ))}
      </div>

      {pendingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="build-confirmation-title"
          >
            <h2
              id="build-confirmation-title"
              className="mb-2 text-lg font-semibold"
            >
              Start {pendingCategory.toUpperCase()} build?
            </h2>

            <div className="flex justify-end gap-3">
              <Button handleClick={closeConfirmation} type="secondary">
                Cancel
              </Button>
              <Button
                disabled={isPending}
                handleClick={confirmBuild}
                type="primary"
              >
                {isPending ? "Starting…" : "Start build"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
