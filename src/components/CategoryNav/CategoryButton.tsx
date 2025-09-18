import React, { JSX } from "react";

interface Props {
  name: string;
  icon: JSX.Element;
  href: string;
  isPinned: boolean;
}

export default function CategoryButton(props: Props) {
  const { name, icon, href, isPinned } = props;

  return (
    <a
      href={href}
      className={`text-white flex justify-center items-center flex-column gap-2`}
    >
      {icon}
      <span className={`text-center font-bold`}>{name}</span>
    </a>
  );
}
