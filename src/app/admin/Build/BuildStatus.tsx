// components/BuildStatus.tsx
import { Loader2, Hammer } from "lucide-react";
import Button from "@/components/Buttons/Button";
import { useBuildStatus, useTriggerBuild } from "@/lib/hooks";

export default function BuildStatus() {
  const { data: status } = useBuildStatus();
  const { mutate: triggerBuild } = useTriggerBuild();

  const isBuilding = status?.is_building ?? false;

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
        {(["acs", "gis", "ckan", "all"] as const).map((category) => (
          <Button
            key={category}
            type="primary"
            disabled={isBuilding}
            handleClick={() => triggerBuild(category)}
          >
            <Hammer size={18} />
            {category.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}
