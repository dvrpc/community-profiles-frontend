import Button from "@/components/Buttons/Button";

interface Props {
  open: boolean;
  paragraphs: string[];

  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal(props: Props) {
  const { open, paragraphs, onConfirm, onCancel } = props;
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
        {/* <h2 className="text-lg font-semibold mb-2">{title}</h2> */}
        {paragraphs.map((p, i) => (
          <p key={i} className="text-gray-700 mb-4">
            {p}
          </p>
        ))}

        <br />
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
