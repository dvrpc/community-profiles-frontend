import Button from "@/components/Buttons/Button";

interface Props {
    open: boolean;
    type?: 'topic' | 'subcategory',
    name?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteModal(props: Props) {
    const { open, type, name, onConfirm, onCancel } = props
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
                {/* <h2 className="text-lg font-semibold mb-2">{title}</h2> */}
                <p className="text-gray-700 mb-6">{`Are you sure you want to delete this ${type}: ${name}`}</p>
                {type == "subcategory" && <p>Deleting a subcategory will delete all child topics.</p>}
                <p>Content & visualizations for deleted topics is preserved in database but not visible on admin page.</p>
                <br />
                <div className="flex justify-end gap-3">
                    <Button
                        handleClick={onCancel}
                        type="secondary"
                    >
                        Cancel
                    </Button>

                    <Button
                        handleClick={onConfirm}
                        type="primary"
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
