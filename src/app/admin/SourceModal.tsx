import Button from "@/components/Buttons/Button";
import { Source, SourceForm } from "@/types/types";
import { useState } from "react";

interface Props {
    initialData: Source | null;
    onCancel: () => void;
    onSave: (source: SourceForm, id?: number) => void;
}

export default function SourceModal(props: Props) {
    const { initialData, onCancel, onSave } = props

    const [form, setForm] = useState<SourceForm>(
        initialData || { name: "", year_to: new Date().getFullYear(), citation: "" }
    );
    const [error, setError] = useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === "year_from" || name === "year_to") {
            setForm({ ...form, [name]: value ? parseInt(value) : undefined });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSaveClick = () => {
        if (!form.name.trim()) {
            setError("Name is required.");
            return;
        }
        if (form.year_to === undefined || isNaN(form.year_to)) {
            setError("Year To is required.");
            return;
        }
        if (!form.citation.trim()) {
            setError("Citation is required.");
            return;
        }

        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                    {initialData ? "Edit Source" : "New Source"}
                </h2>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                <div className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Name <span className="text-red-600">*</span></label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Year From</label>
                            <input
                                name="year_from"
                                type="number"
                                value={form.year_from ?? ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Year To <span className="text-red-600">*</span></label>
                            <input
                                name="year_to"
                                type="number"
                                value={form.year_to}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Citation <span className="text-red-600">*</span></label>
                        <textarea
                            name="citation"
                            required
                            value={form.citation}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 h-24"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        handleClick={onCancel}
                        type="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        handleClick={handleSaveClick}
                        type="primary"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
