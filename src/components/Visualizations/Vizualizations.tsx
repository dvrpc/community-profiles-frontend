"use client";

import { CategoryKeys, GeoLevel, Visualization } from "@/types/types";
import VizMap from "./VizMap/VizMap";
import VegaChart from "./Chart/VegaChart";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/consts";

interface Props {
  id: number;
  category: CategoryKeys;
  subcategory: string;
  topic: string;
  geoLevel: GeoLevel;
  geoid: string;
  buffer_bbox: string;
}

export default function Visualizations(props: Props) {
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { id, category, subcategory, topic, geoLevel, geoid, buffer_bbox } = props;
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });

  useEffect(() => {
    if (isLoaded || !inView) return;

    const searchParams = new URLSearchParams({
      ...(geoLevel != "region" && { geoid: geoid }),
      category: category,
      subcategory: subcategory,
      topic: topic,
    });

    const fetchVisualizations = async () => {
      let url = `${API_BASE_URL}/viz/${id}/${geoLevel}`

      if (geoLevel != 'region') {
        console.log(geoLevel)
        url += `/${geoid}`
      }
      const vizResponse = await fetch(url);
      const data = (await vizResponse.json()) as Visualization[];
      setVisualizations(data);
      setIsLoaded(true);
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

  return (
    <div ref={ref}>
      {visualizations && visualizations.map((viz, i) => getViz(viz, i))}
    </div>
  );
}
