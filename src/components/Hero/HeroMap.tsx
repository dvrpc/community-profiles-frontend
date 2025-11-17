"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatBounds, Map } from "mapbox-gl";
import { ACCESS_TOKEN, regionBounds } from "@/consts";
import sources from "./mapSources";
import getLayers from "./mapLayers";
import { GeoLevel, MouseEvent } from "@/types/types";
import { useRouter } from "next/navigation";
import { getMunicipalitySlugFromGeoid, parseBounds } from "@/utils";


interface Props {
  buffer_box?: string;
  geoid?: string;
  geoLevel?: GeoLevel;
  viewPort: string;
}



const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

mapboxgl.accessToken = ACCESS_TOKEN;

export default function HeroMap(props: Props) {
  const [hoverId, setHoverId] = useState<string>("");
  const { buffer_box, geoid, geoLevel, viewPort } = props;

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>(null);
  const hoverIdRef = useRef(hoverId);
  const router = useRouter();

  useEffect(() => {
    const bounds = buffer_box ? parseBounds(buffer_box) : regionBounds;
    const hoverSource =
      geoLevel == "county" ? "municipalboundaries" : "countyboundaries";

    const hoverGeoFill = (e: MouseEvent) => {
      if (!e.features) return;
      const map = mapRef.current;
      if (!map) return;

      const hoverId = hoverIdRef.current;

      const topSource = e.features[0].source;

      if (hoverSource == topSource) {
        map.getCanvas().style.cursor = "pointer";
      } else {
        map.getCanvas().style.cursor = "";
      }

      const foundHoverId = e.features[0].id + "";

      if (e.features.length > 0) {
        if (hoverId && foundHoverId !== hoverId) {
          map.setFeatureState(
            {
              source: hoverSource,
              sourceLayer: hoverSource,
              id: hoverId,
            },
            { hover: false }
          );
        }

        setHoverId(foundHoverId);
        map.setFeatureState(
          {
            source: hoverSource,
            sourceLayer: hoverSource,
            id: foundHoverId,
          },
          { hover: true }
        );
        const properties = e.features[0].properties;
        if (!properties) return;
        const tooltipHTML = geoLevel
          ? properties.mun_name
          : properties.co_name + " County";
        popup.setLngLat(e.lngLat.wrap()).setHTML(tooltipHTML).addTo(map);
      }
    };

    const leaveGeoFill = () => {
      const map = mapRef.current;
      if (!map) return;

      const hoverId = hoverIdRef.current;
      map.getCanvas().style.cursor = "";

      if (hoverId) {
        map.setFeatureState(
          {
            source: hoverSource,
            sourceLayer: hoverSource,
            id: hoverId,
          },
          { hover: false }
        );
      }
      setHoverId("");
      popup.remove();
    };

    const handleClick = (e: MouseEvent) => {
      if (!e.features) return;
      const selectedFeature = e.features[0];
      const source = selectedFeature.source;

      if (!selectedFeature.properties) return;

      const county: string =
        selectedFeature.properties["co_name"].toLowerCase();

      if (source == "countyboundaries") {
        router.push("/" + county);
      } else {
        const municipality = getMunicipalitySlugFromGeoid(
          county,
          selectedFeature.properties["geoid"]
        );
        router.push(`/${county}/${municipality}`);
      }
    };

    if (mapContainer.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/ckirby98/cm16u1uii005r01qkaqb42e2j",
        trackResize: true,
        scrollZoom: false,
        dragPan: false,
        bounds: bounds,
        interactive: false,
      });

      const map = mapRef.current;

      map.on("load", () => {
        for (const source in sources) map.addSource(source, sources[source]);

        const layers = getLayers(geoid, geoLevel);

        for (const layer in layers) {
          const beforeId =
            layers[layer].type === "fill" ? "waterway-shadow" : "road-label";
          map.addLayer(layers[layer], beforeId);
        }

        if (geoLevel != "municipality") {
          map.on(
            "mousemove",
            ["municipality-fill", "county-fill"],
            hoverGeoFill
          );
          map.on(
            "mouseleave",
            ["municipality-fill", "county-fill"],
            leaveGeoFill
          );
          map.on("click", ["municipality-fill", "county-fill"], handleClick);
        }
      });

      return () => {
        map.remove();
      };
    }
  }, []);

  useEffect(() => {
    hoverIdRef.current = hoverId;
  }, [hoverId]);

  return (
    <div
      className={`absolute ${viewPort} w-2/3`}
      id="map-container"
      ref={mapContainer}
    />
  );
}
