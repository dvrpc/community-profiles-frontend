"use client";
import React, { createContext, useContext, useState } from "react";

interface ScrollContext {
  activeCategoryId: number;
  activeSubcategoryId: number;
  setActiveCategories: (cat: number, subcat: number) => void;
}
const ScrollContext = createContext<ScrollContext | null>(null);

export default function ScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(1);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<number>(0);

  function setActiveCategories(cat: number, subcat: number) {
    setActiveCategoryId(cat);
    setActiveSubcategoryId(subcat);
  }

  return (
    <ScrollContext.Provider
      value={{
        activeCategoryId,
        activeSubcategoryId,
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
