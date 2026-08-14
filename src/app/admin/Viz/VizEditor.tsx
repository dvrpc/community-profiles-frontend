import { JsonEditor } from "json-edit-react";
import { Visualization } from "@/types/types";

interface Props {
  visualizations: Visualization[];
  handleChange: (value: Visualization[]) => void;
}
export default function VizEditor(props: Props) {
  const { visualizations, handleChange } = props;

  const onChange = (data: unknown) => {
    handleChange(data as Visualization[]);
  };

  return (
    <div className="flex-grow overflow-auto">
      <JsonEditor
        rootFontSize={12}
        maxWidth={"100%"}
        data={visualizations}
        setData={onChange}
      />
    </div>
  );
}
