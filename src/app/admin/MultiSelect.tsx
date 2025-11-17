import { Source } from "@/types/types";
import Select, { MultiValue, OptionsOrGroups } from 'react-select'
import {
    Option
} from "./ContentForm";

interface Props {
    options: Option[];
    value: Option[];
    onChange: (selectedValue: readonly Option[]) => void;
}

// const options = [
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' }
// ]


export default function MultiSelect(props: Props) {
    const { options, value, onChange } = props

    return <Select value={value} options={options} isMulti onChange={onChange} />
}