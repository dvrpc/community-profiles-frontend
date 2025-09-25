"use client";
import { CategoryKeys } from "@/types";
import React, { createContext, useContext, useState } from "react";

interface ScrollContext {
  activeCategory: CategoryKeys;
  activeSubcategory: string;
  setActiveCategories: (cat: CategoryKeys, subcat: string) => void;
}
const ScrollContext = createContext<ScrollContext | null>(null);

export default function ScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeCategory, setActiveCategory] = useState<CategoryKeys>(
    "demographics-housing"
  );
  const [activeSubcategory, setActiveSubcategory] = useState<string>("");

  function setActiveCategories(cat: CategoryKeys, subcat: string) {
    console.log(cat + " - " + subcat);
    setActiveCategory(cat);
    setActiveSubcategory(subcat);
  }

  return (
    <ScrollContext.Provider
      value={{
        activeCategory,
        activeSubcategory,
        setActiveCategories,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollContext() {
  const context = useContext(ScrollContext);
  if (!context)
    throw Error("useScrollContext can only be used inside an ScrollProvider");
  return context;
}
