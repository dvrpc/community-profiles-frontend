"use client"
import { TreeTopic } from "@/types/types";
import { displaySubcategoryTopicTitle } from "@/utils";
import { useState } from "react";

interface Props {
  isActive: boolean;
  subcategory: string;
  topics: TreeTopic[];
  navOpen: boolean;
}

export default function SubcategoryDropdown(props: Props) {
  const { isActive, subcategory, topics, navOpen } = props;
  const [isOpen, setIsOpen] = useState(false)

  const handleHover = () => {
    setIsOpen(true)
  }

  const handleHoverLeave = () => {
    setIsOpen(false)
  }


  return (
    <div onMouseLeave={handleHoverLeave} className="relative">
      <a onMouseEnter={handleHover} className={`px-4 ${isActive && 'border-b-2'}`} href={`#${subcategory}`}>
        {displaySubcategoryTopicTitle(subcategory)}
      </a>
      <ul className={`absolute flex flex-col bg-dvrpc-blue-1 p-4 min-w-full rounded-b-sm transition-opacity duration-200 ease-in ${!isOpen ? "opacity-0 invisible" : "opacity-100"}`}>
        {topics.map((topic) => (
          <li key={topic.id}
          >
            <a
              href={`#${subcategory}-${topic.name}`}
            >
              {topic.label}
            </a>
          </li>
        ))}
      </ul>

    </div >

  );
}
