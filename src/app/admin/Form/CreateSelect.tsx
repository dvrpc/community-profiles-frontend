import { SelectOption } from "@/types/types";
import React, { useState } from "react";

import CreatableSelect from "react-select/creatable";

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ""),
});

const defaultOptions = [
  createOption("One"),
  createOption("Two"),
  createOption("Three"),
];

interface Props {
  options: SelectOption[];
  value: SelectOption[];
}

export default function CreateSelect(props: Props) {
  const { options, value } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = (inputValue: string) => {
    // setIsLoading(true);
    // setTimeout(() => {
    //   const newOption = createOption(inputValue);
    //   setIsLoading(false);
    //   setOptions((prev) => [...prev, newOption]);
    //   setValue(newOption);
    // }, 1000);
  };

  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      // onChange={(newValue) => setValue(newValue)}
      onCreateOption={handleCreate}
      options={options}
      value={value}
    />
  );
}
