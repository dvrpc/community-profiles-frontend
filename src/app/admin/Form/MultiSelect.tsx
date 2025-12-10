import { SelectOption } from "@/types/types";
import Select from 'react-select'


interface Props {
    options: SelectOption[];
    value: SelectOption[];
    onChange: (selectedValue: readonly SelectOption[]) => void;
}



export default function MultiSelect(props: Props) {
    const { options, value, onChange } = props

    return <Select value={value} options={options} isMulti onChange={onChange} />
}