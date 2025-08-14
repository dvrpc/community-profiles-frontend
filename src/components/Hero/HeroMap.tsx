"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import {
  HEADER_HEIGHT,
  NAV_HEIGHT,
  REMAINING_VIEWPORT_HEIGHT_PROPERTY,
} from "@/consts";
import sources from "./mapSources";
import layers from "./mapLayers";

export default function HeroMap() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/ckirby98/cm16u1uii005r01qkaqb42e2j",
        // center: [-75.2273, 40.071],
        trackResize: true,
        scrollZoom: false,
        dragPan: false,
        bounds: [
          [-76.59405517578125, 39.44211914385648],
          [-74.32525634765625, 40.664734298694216],
        ],
      });

      map.on("load", () => {
        for (const source in sources) map.addSource(source, sources[source]);
        for (const layer in layers) {
          const beforeId =
            layers[layer].type === "fill" ? "waterway-shadow" : "road-label";
          map.addLayer(layers[layer], beforeId);
        }
      });
      // Add zoom controls

      // Add your custom markers and lines here

      // Clean up on unmount
      return () => map.remove();
    }
  }, []);

  return (
    <div
      className={`absolute ${REMAINING_VIEWPORT_HEIGHT_PROPERTY} w-2/3`}
      id="map-container"
      ref={mapContainer}
    />
  );
}
