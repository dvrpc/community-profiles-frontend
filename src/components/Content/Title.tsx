"use client";

import { useScrollContext } from "@/context/ScrollProvider";
import { useEffect, useRef } from "react";

interface Props {
  title: string;
  urlId: string;
  type: "h2" | "h3";
  categoryId: number;
  subcategoryId: number;
}

const SCROLL_THRESHOLD = 250;

export default function Title(props: Props) {
  const { title, urlId, type, categoryId, subcategoryId } = props;
  const { setActiveCategories } = useScrollContext();
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.addEventListener("scroll", function () {
      if (!ref.current) return;
      const position = ref.current.getBoundingClientRect();

      if (position.top - SCROLL_THRESHOLD <= 0) {
        setActiveCategories(categoryId, subcategoryId);
      }
    });
  }, []);

  if (type == "h2") {
    return (
      <h2
        id={urlId}
        className="text-4xl text-dvrpc-blue-1 font-bold mb-8 text-center scroll-mt-32"
        ref={ref}
      >
        {title}
      </h2>
    );
  } else {
    return (
      <h3 id={urlId} className="text-3xl scroll-mt-32 mt-16" ref={ref}>
        {title}
      </h3>
    );
  }
}
