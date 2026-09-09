import { SelectOption } from "@/types/types";
import Select, { StylesConfig } from "react-select";

interface Props {
  options: SelectOption[];
  value: SelectOption[];
  onChange: (selectedValue: readonly SelectOption[]) => void;
}

const customStyles: StylesConfig<SelectOption, true> = {
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

export default function MultiSelect(props: Props) {
  const { options, value, onChange }: Props = props;

  return (
    <Select
      value={value}
      options={options}
      isMulti
      onChange={onChange}
      styles={customStyles}
    />
  );
}
