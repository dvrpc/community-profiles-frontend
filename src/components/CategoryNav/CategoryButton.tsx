import React, { JSX } from "react";

interface Props {
  name: string;
  icon: JSX.Element;
  href: string;
  isActive: boolean;
}

export default function CategoryButton(props: Props) {
  const { name, icon, href, isActive } = props;

  return (
    <a
      href={href}
      className={`${
        isActive && "border-b-2 border-white"
      } text-white flex justify-center items-center flex-column gap-2 pb-4`}
    >
      {icon}
      <span className={`text-center font-bold`}>{name}</span>
    </a>
  );
}
