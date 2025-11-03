import { JsonData, JsonEditor } from "json-edit-react";

interface Props {
  visualizations: string;
  handleChange: (value: string) => void;
}
export default function VizEditor(props: Props) {
  const { visualizations, handleChange } = props;

  const onChange = (data: unknown) => {
    handleChange(data as string);
  };

  return (
    <div className="h-full overflow-auto">
      <JsonEditor
        rootFontSize={12}
        maxWidth={"100%"}
        data={visualizations}
        setData={onChange} // optional
      />
    </div>
  );
}
