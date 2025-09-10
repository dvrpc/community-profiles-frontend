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
      className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
      onClick={handleClick}
    >
      {icon}
      <span className="sr-only">{description}</span>
    </button>
  );
}
