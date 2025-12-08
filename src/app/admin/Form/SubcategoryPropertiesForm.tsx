"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Buttons/Button";
import { diff } from "@/lib/utils";
import { SubcategoryPropertyForm } from "@/types/types";



interface Props {
    id: number;
    initialData: SubcategoryPropertyForm;
    handleSave: (id: number, payload: Partial<SubcategoryPropertyForm>) => void;
}

export default function SubcategoryPropertiesForm(props: Props) {
    const { id, initialData, handleSave } = props;

    const [label, setLabel] = useState(initialData.label);
    const [sortWeight, setSortWeight] = useState(initialData.sort_weight);

    useEffect(() => {
        setLabel(initialData.label);
        setSortWeight(initialData.sort_weight);
    }, [id, initialData.label, initialData.sort_weight]);

    const handleSaveClick = () => {
        const current: SubcategoryPropertyForm = {
            label,
            sort_weight: sortWeight,
        };

        const changedPayload = diff(initialData, current);

        if (Object.keys(changedPayload).length === 0) {
            alert("No changes detected.");
            return;
        }

        handleSave(id, changedPayload);
    };

    return (
        <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
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
                    <label className="font-medium">Sort Weight</label>
                    <input
                        type="number"
                        value={sortWeight}
                        onChange={(e) => setSortWeight(parseInt(e.target.value))}
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