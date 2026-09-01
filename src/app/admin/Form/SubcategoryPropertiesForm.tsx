"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Buttons/Button";
import { diff } from "@/lib/utils";
import { useSubcategory, useUpdateSubcategory } from "@/lib/hooks";
import { SubcategoryPropertyForm } from "@/types/types";
import { useAdminToast } from "../Toast/AdminToast";

interface Props {
    id: number;
}

const emptySubcategory: SubcategoryPropertyForm = {
    label: "",
    url_id: "",
    sort_weight: 0,
};

export default function SubcategoryPropertiesForm(props: Props) {
    const { id } = props;
    const { data: subcategory } = useSubcategory(id);
    const subcategoryUpdateMutation = useUpdateSubcategory();
    const { showToast, showError } = useAdminToast();
    const initialData = subcategory ?? emptySubcategory;

    const [label, setLabel] = useState(initialData.label ?? "");
    const [urlId, setUrlId] = useState(initialData.url_id ?? "");
    const [sortWeight, setSortWeight] = useState(initialData.sort_weight ?? 0);

    useEffect(() => {
        setLabel(initialData.label ?? "");
        setUrlId(initialData.url_id ?? "");
        setSortWeight(initialData.sort_weight ?? 0);
    }, [id, subcategory, initialData.label, initialData.url_id, initialData.sort_weight]);

    if (!subcategory) return <div>Loading...</div>;

    const handleSaveClick = () => {
        const current: SubcategoryPropertyForm = {
            label,
            url_id: urlId,
            sort_weight: sortWeight,
        };

        const changedPayload = diff(initialData, current);

        if (Object.keys(changedPayload).length === 0) {
            alert("No changes detected.");
            return;
        }

        subcategoryUpdateMutation.mutate(
            { subcategoryId: id, subcategory: changedPayload },
            {
                onSuccess: () => showToast(`Subcategory saved successfully (ID: ${id}).`),
                onError: (error) =>
                    showError(error, `Failed to save subcategory (ID: ${id})`),
            },
        );
    };

    return (
        <form className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full flex flex-col gap-1">
                    <label className="font-medium">Label</label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="border border-dvrpc-gray-5 p-2 rounded"
                    />
                </div>

                <div className="w-full flex flex-col gap-1">
                    <label className="font-medium">URL ID</label>
                    <input
                        type="text"
                        value={urlId}
                        onChange={(e) => setUrlId(e.target.value)}
                        className="border border-dvrpc-gray-5 p-2 rounded"
                    />
                </div>

                <div className="w-full flex flex-col gap-1 md:col-span-2">
                    <label className="font-medium">Sort Weight</label>
                    <input
                        type="number"
                        value={sortWeight}
                        onChange={(e) => setSortWeight(parseInt(e.target.value) || 0)}
                        className="border border-dvrpc-gray-5 p-2 rounded"
                    />
                </div>
            </div>

            <div className="mt-4">
                <Button type="primary" handleClick={handleSaveClick}>
                    Save
                </Button>
            </div>
        </form>
    );
}