import Button from "@/components/Buttons/Button";

interface Props {
  type: "subcategory" | "topic";
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({
  type,
  name,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete this {type}: &quot;{name}&quot;?
        </p>
        {type === "subcategory" && (
          <p className="text-gray-700 mb-4">
            Deleting a subcategory will delete all child topics.
          </p>
        )}
        <p className="text-gray-700 mb-4">
          Content &amp; visualizations for deleted items is preserved in
          database but not visible on admin page.
        </p>
        <div className="flex justify-end gap-3">
          <Button handleClick={onCancel} type="secondary">
            Cancel
          </Button>
          <Button handleClick={onConfirm} type="primary">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
