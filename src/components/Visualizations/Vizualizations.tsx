"use client";

import { GeoLevel, Viz } from "@/types/types";
import VizMap from "./VizMap/VizMap";
import VegaChart from "./Chart/VegaChart";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/consts";
import { useCartVizVars } from "../DataCart/CartProvider";

interface Props {
  topicId: number;
  geoLevel: GeoLevel;
  geoid: string;
  buffer_bbox: string;
}

export default function Visualizations(props: Props) {
  const [visualizations, setVisualizations] = useState<Viz[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { topicId, geoLevel, geoid, buffer_bbox } = props;
  const { setVizVars } = useCartVizVars();
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (isLoaded || !inView) return;

    const fetchVisualizations = async () => {
      let url = `${API_BASE_URL}/viz/${topicId}/${geoLevel}`;

      if (geoLevel != "region") {
        url += `/${geoid}`;
      }
      const vizResponse = await fetch(url);
      const data = (await vizResponse.json()) as Viz[];

      const variables: string[] = [];
      data.forEach((viz) => {
        if (viz.file.type == "chart") {
          variables.push(...viz.variables);
          viz.variables;
        }
      });
      setVizVars(topicId, variables);
      setVisualizations(data);
      setIsLoaded(true);
    };

    fetchVisualizations();
  }, [inView]);

  function getViz(viz: Viz, i: number) {
    if (viz.file.type == "map") {
      return (
        <VizMap
          key={i}
          features={viz.file.features}
          legendOverride={viz.file.legendOverride}
          alt={viz.file.alt}
          buffer_box={buffer_bbox}
          geoLevel={geoLevel}
          geoid={geoid}
        />
      );
    }
    if (viz.file.type == "chart") {
      return <VegaChart key={i} spec={viz.file.schema} />;
    }
  }

  return (
    <div ref={ref}>
      {visualizations && visualizations.map((viz, i) => getViz(viz, i))}
    </div>
  );
}
