"use client";

import { CategoryKeys, GeoLevel, Visualization } from "@/types";
import VizMap from "./VizMap/VizMap";
import VegaChart from "./Chart/VegaChart";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/consts";

interface Props {
  category: CategoryKeys;
  subcategory: string;
  topic: string;
  geoLevel: GeoLevel;
  geoid: string;
  buffer_bbox: string;
}

export default function Visualizations(props: Props) {
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const { category, subcategory, topic, geoLevel, geoid, buffer_bbox } = props;
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });

  useEffect(() => {
    if (visualizations.length > 0 || !inView) return;

    const searchParams = new URLSearchParams({
      geoid: geoid,
      category: category,
      subcategory: subcategory,
      topic: topic,
    });

    const fetchVisualizations = async () => {
      const vizResponse = await fetch(
        `${API_BASE_URL}/viz/${geoLevel}?${searchParams}`
      );
      const data = (await vizResponse.json()) as Visualization[];
      setVisualizations(data);
    };

    fetchVisualizations();
  }, [inView]);

  function getViz(viz: Visualization, i: number) {
    if (viz.type == "map") {
      return (
        <VizMap
          key={i}
          features={viz.features}
          legendOverride={viz.legendOverride}
          buffer_box={buffer_bbox}
          geoLevel={geoLevel}
          geoid={geoid}
        />
      );
    }
    if (viz.type == "chart") {
      return <VegaChart key={i} spec={viz.schema} />;
    }
  }

  //
  return (
    <div ref={ref}>
      {visualizations && visualizations.map((viz, i) => getViz(viz, i))}
    </div>
  );
}
