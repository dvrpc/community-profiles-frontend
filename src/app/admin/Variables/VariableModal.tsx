import Button from "@/components/Buttons/Button";
import { Variable, VariableForm } from "@/types/types";
import { useState } from "react";

interface Props {
    initialData: Variable | null;
    onCancel: () => void;
    onSave: (variable: VariableForm) => void;
}

export default function VariableModal(props: Props) {
    const { initialData, onCancel, onSave } = props;

    const [form, setForm] = useState<VariableForm>(
        initialData || {
            name: "",
            category: "",
            data_source: "acs",
            geo_level: "",
            acs_variable: "",
            gis_table: "",
            resource_ids: "",
            data_year: undefined,
            catalog_table: "",
            description: "",
            acs_concept: "",
        }
    );
    const [error, setError] = useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === "data_year" ? (value ? parseInt(value) : undefined) : value,
        });
    };

    const handleSaveClick = () => {
        if (!form.name.trim()) {
            setError("Name is required.");
            return;
        }
        if (!form.category.trim()) {
            setError("Category is required.");
            return;
        }
        if (form.data_source !== "acs") {
            setError("Only ACS variables can be managed here.");
            return;
        }

        setError("");
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 overflow-auto h-9/10">
                <h2 className="text-xl font-semibold mb-4">
                    {initialData ? "Edit Variable" : "New Variable"}
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
                    <div>
                        <label className="block font-medium mb-1">Category <span className="text-red-600">*</span></label>
                        <input
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Data Source</label>
                        <input
                            name="data_source"
                            value={form.data_source}
                            disabled
                            className="w-full border rounded-lg p-2 bg-dvrpc-gray-1 text-dvrpc-gray-9"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Geo Level</label>
                            <input
                                name="geo_level"
                                value={form.geo_level ?? ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Data Year</label>
                            <input
                                name="data_year"
                                type="number"
                                value={form.data_year ?? ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">ACS Variable</label>
                            <input
                                name="acs_variable"
                                value={form.acs_variable ?? ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">ACS Concept</label>
                            <input
                                name="acs_concept"
                                value={form.acs_concept ?? ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                    </div>


                    <div>
                        <label className="block font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={form.description ?? ""}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 h-28"
                        />
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <Button handleClick={onCancel} type="secondary">
                        Cancel
                    </Button>
                    <Button handleClick={handleSaveClick} type="primary">
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
