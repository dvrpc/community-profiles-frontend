import Image from "next/image";
import DemographicHousingIcon from "../Icons/DemographicHousingIcon";
import React, { JSX, ReactNode } from "react";

interface Props {
  name: string;
  icon: JSX.Element;
  href: string;
}

export default function CategoryButton(props: Props) {
  const { name, icon, href } = props;

  return (
    <a href={href} className="text-white flex justify-start flex-col">
      {icon}
      <span className="text-center text-lg text-li">{name}</span>
    </a>
  );
}
