import Button from "@/components/Buttons/Button";

interface Props {
    content: string;
    hasEdits: boolean;
    saveChanges: () => void;
}
export default function MarkdownPreview(props: Props) {
    const { content, hasEdits, saveChanges } = props
    console.log(hasEdits)

    const handleClick = () => {
        if (hasEdits) {
            saveChanges()
        }
    }

    return (
        <div className="w-1/3">
            <div className="border-b-2 border-dvrpc-gray-7 flex justify-between p-4 h-20">
                <h3 className="text-dvrpc-blue-1 text-3xl">Preview</h3>
                <Button
                    type="primary"
                    disabled={!hasEdits}
                    handleClick={handleClick}
                >
                    Save Changes
                </Button>
            </div>
            <div className="flex flex-col gap-4 px-4 py-6" dangerouslySetInnerHTML={{ __html: content }}>
            </div>
        </div>

    )
}