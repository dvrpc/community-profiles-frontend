import { JSX } from "react";

interface Props {
  icon: JSX.Element;
  description: string;
  handleClick: () => void;
}

export default function IconButton(props: Props) {
  const { icon, description, handleClick } = props;
  return (
    <button
      type="button"
      className="text-dvrpc-gray-1 hover:cursor-pointer hover:bg-dvrpc-gray-5 hover:text-white font-medium rounded-md p-2 text-center inline-flex items-center dark:hover:text-white"
      onClick={handleClick}
    >
      {icon}
      <span className="sr-only">{description}</span>
    </button>
  );
}
