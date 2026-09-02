"use client";
import { Link } from "@/types/types";
import React, { useEffect, useState, useRef } from "react";

interface Props {
  label: string;
  links?: Link[];
  icon: React.ReactNode;
}

export default function LinkButton(props: Props) {
  const { label, links = [], icon } = props;
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (links.length === 0) return null;

  if (links.length === 1) {
    return (
      <a
        href={links[0].link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-2 items-center hover:cursor-pointer hover:text-dvrpc-blue-1"
      >
        {icon}
        {label}
      </a>
    );
  }

  return (
    <div className="relative flex">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex gap-2 items-center hover:cursor-pointer hover:text-dvrpc-blue-1 ${open && "text-dvrpc-blue-1"}`}
      >
        {icon}
        {label}
      </button>
      {open && (
        <div
          ref={popupRef}
          className="z-10 mt-8 absolute right-0 bg-white border border-gray-300 rounded shadow-lg min-w-[500px] max-w-[90vw]"
        >
          {links.map((link, i) => (
            <a
              key={i}
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 hover:bg-gray-100 text-sm"
              onClick={() => setOpen(false)}
            >
              {link.link}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
