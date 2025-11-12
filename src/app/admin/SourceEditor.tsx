import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import SourceModal from "./SourceModal";
import { Source, SourceForm } from "@/types/types";
import Button from "@/components/Buttons/Button";
import IconButton from "@/components/Buttons/IconButton";
import { useCreateSource, useDeleteSource, useSource, useUpdateSource } from "@/lib/hooks";


export default function SourceManager() {
    // const [sources, setSources] = useState<Source[]>([
    //     {
    //         id: 1,
    //         name: "Traffic Study Report",
    //         year_from: 2019,
    //         year_to: 2021,
    //         citation: "DVRPC (2021). Traffic Study Report 2019–2021.",
    //     },
    //     {
    //         id: 2,
    //         name: "Regional Plan 2050",
    //         citation: "DVRPC (2020). Regional Plan 2050.",
    //         year_to: 2020
    //     },
    // ]);
    const { data: sources } = useSource()
    const createMutation = useCreateSource()
    const updateMutation = useUpdateSource()
    const deleteMutation = useDeleteSource()

    const [editing, setEditing] = useState<Source | null>(null);
    const [showModal, setShowModal] = useState(false);

    if (!sources) return <></>

    const setSources = (sources: Source[]) => {

    }

    const handleSave = (source: SourceForm) => {
        console.log(source)
        if (!source.id) {
            createMutation.mutate(source)
        } else {
            const { id, ...sourceBody } = source
            updateMutation.mutate({ id: source.id, source: sourceBody })
        }

        setEditing(null);
        setShowModal(false);
    };

    const handleDelete = (id: number) => {
        setSources(sources.filter(s => s.id !== id));
    };

    const handleEdit = (source: Source) => {
        setEditing(source);
        setShowModal(true);
    }

    return (
        <>
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Sources</h1>
                    <Button

                        handleClick={() => {
                            setEditing(null);
                            setShowModal(true);
                        }} type={"primary"}
                    >
                        <Plus size={18} /> Add Source

                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-dvrpc-gray-7 text-left">
                                <th className="p-3">Name</th>
                                <th className="p-3">Year From</th>
                                <th className="p-3">Year To</th>
                                <th className="p-3">Citation</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sources.map(source => (
                                <tr
                                    key={source.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="p-3">{source.name}</td>
                                    <td className="p-3">{source.year_from ?? "—"}</td>
                                    <td className="p-3">{source.year_to ?? "—"}</td>
                                    <td className="p-3 text-sm text-dvrpc-gray-2">{source.citation}</td>
                                    <td className="p-3 text-center">
                                        <IconButton
                                            handleClick={() => handleEdit(source)}
                                            description="Edit Source"
                                            icon={<Pencil size={18} className="text-dvrpc-blue-3" />}                                            // className="inline-flex items-center text-blue-600 hover:text-blue-800 mr-3"
                                        />
                                        <IconButton
                                            handleClick={() => handleDelete(source.id)}
                                            description="Edit Source"
                                            icon={<Trash2 size={18} color="red" />}                                            // className="inline-flex items-center text-blue-600 hover:text-blue-800 mr-3"
                                        />

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <SourceModal
                    initialData={editing}
                    onCancel={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </>
    );
}
