"use client";

import { useScrollContext } from "@/context/ScrollProvider";
import { CategoryKeys } from "@/types";
import { displaySubcategoryTopicTitle } from "@/utils";
import { useEffect, useRef } from "react";

interface Props {
  title: string;
  type: "h2" | "h3";
  category: CategoryKeys;
  subcategory: string;
}

const SCROLL_THRESHOLD = 250;

export default function Title(props: Props) {
  const { title, type, category, subcategory } = props;
  const { setActiveCategories } = useScrollContext();
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.addEventListener("scroll", function () {
      if (!ref.current) return;
      const position = ref.current.getBoundingClientRect();

      if (position.top - SCROLL_THRESHOLD <= 0) {
        setActiveCategories(category, subcategory); //TODO: use top rather than in view?
      }
    });
  }, []);

  if (type == "h2") {
    return (
      <h2
        id={category}
        className="text-4xl text-dvrpc-blue-1 font-bold mb-8 text-center scroll-mt-32"
        ref={ref}
      >
        {title}
      </h2>
    );
  } else {
    return (
      <h3 id={subcategory} className="text-3xl scroll-mt-32" ref={ref}>
        {title}
      </h3>
    );
  }
}
