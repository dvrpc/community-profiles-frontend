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
      className={`text-white flex justify-start ${isPinned ? "flex-row" : "flex-col"
        }`}
    >
      {icon}
      <span className="text-center text-lg text-li">{name}</span>
    </a>
  );
}
