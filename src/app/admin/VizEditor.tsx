import { JsonData, JsonEditor } from "json-edit-react";

interface Props {
  visualizations: string;
  setVisualizations: (visualizations: string) => void;
  hasEdits: boolean;
  setHasEdits: (value: boolean) => void;
}
export default function VizEditor(props: Props) {
  const { visualizations, setVisualizations, hasEdits, setHasEdits } = props;

  const handleChange = (data: unknown) => {
    setVisualizations(data as string);

    if (!hasEdits) {
      setHasEdits(true);
    }
  };

  return (
    <div className="h-full overflow-auto">
      <JsonEditor
        rootFontSize={12}
        maxWidth={"100%"}
        data={visualizations}
        setData={handleChange} // optional
      />
    </div>
  );
}
