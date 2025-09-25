"use client";

import { parseBounds } from "@/utils";
import mapboxgl, { Map, NavigationControl } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import getSources from "./mapSources";
import getLayers from "./mapLayers";
import {
  GeoLevel,
  Feature,
  MouseEvent,
  GeoJSONProperties,
  LegendOverrideItem,
} from "@/types";
import { ACCESS_TOKEN } from "@/consts";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import SelectionPopup from "./SelectionPopup";
import { LngLat } from "mapbox-gl";
import Legend from "./Legend";

interface Props {
  features: Feature[];
  buffer_box: string;
  geoLevel: GeoLevel;
  geoid: string;
  legendOverride?: LegendOverrideItem[];
}

mapboxgl.accessToken = ACCESS_TOKEN;

const geocoder = new MapboxGeocoder({
  accessToken: ACCESS_TOKEN,
  placeholder: "Search to location",
  bbox: [
    -76.09405517578125, 39.49211914385648, -74.32525634765625,
    40.614734298694216,
  ],
  marker: false,
});

// const tooltip = new mapboxgl.Popup({
//   anchor: "left",
//   offset: 15,
//   closeButton: false,
// });

interface HoverObject {
  id: string;
  source: string;
}

type SelectObject = HoverObject & {
  properties: GeoJSONProperties | null;
  coordinates: LngLat;
};

export default function VizMap(props: Props) {
  const [hover, setHover] = useState<HoverObject | null>(null);
  const [select, setSelect] = useState<SelectObject | null>(null);

  const { features, buffer_box, geoLevel, geoid, legendOverride } = props;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>(null);
  const hoverRef = useRef<HoverObject | null>(null);
  const selectRef = useRef<SelectObject | null>(null);

  const bounds = parseBounds(buffer_box);

  function removeSelection() {
    if (!mapRef.current || !selectRef.current) return;
    mapRef.current.setFeatureState(
      {
        source: selectRef.current.source,
        sourceLayer: selectRef.current.source,
        id: selectRef.current.id,
      },
      { selected: false }
    );
    setSelect(null);
  }

  function flyToSelect() {
    if (!mapRef.current || !selectRef.current) return;
    mapRef.current.flyTo({
      center: selectRef.current.coordinates,
      zoom: 13,
      speed: 2,
      duration: 1000,
      essential: true,
    });
  }

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const hoverGeoFill = (e: MouseEvent) => {
      if (!e.features) return;
      if (!mapRef.current) return;
      mapRef.current.getCanvas().style.cursor = "pointer";

      const topSource = e.features[0].source;

      if (topSource) {
        if (hoverRef.current?.source) {
          mapRef.current.setFeatureState(
            {
              source: hoverRef.current.source,
              sourceLayer: hoverRef.current.source,
              id: hoverRef.current.id,
            },
            { hover: false }
          );
        }

        const foundHoverId = e.features[0].id + "";
        const foundHoverSource = e.features[0].source + "";

        setHover({
          id: foundHoverId,
          source: foundHoverSource,
        });

        mapRef.current.setFeatureState(
          {
            source: foundHoverSource,
            sourceLayer: foundHoverSource,
            id: foundHoverId,
          },
          { hover: true }
        );
      }
    };

    const leaveGeoFill = () => {
      if (!mapRef.current) return;

      mapRef.current.getCanvas().style.cursor = "";

      if (hoverRef.current) {
        mapRef.current.setFeatureState(
          {
            source: hoverRef.current.source,
            sourceLayer: hoverRef.current.source,
            id: hoverRef.current.id,
          },
          { hover: false }
        );
      }
      setHover(null);
    };

    const handleClick = (e: MouseEvent) => {
      if (!mapRef.current || !e.features) return;

      if (selectRef.current) {
        removeSelection();
      }
      const foundSelectId = e.features[0].id + "";
      const foundSelectSource = e.features[0].source + "";
      const foundProperties = e.features[0].properties;

      setSelect({
        id: foundSelectId,
        source: foundSelectSource,
        properties: foundProperties,
        coordinates: e.lngLat,
      });

      mapRef.current.setFeatureState(
        {
          source: foundSelectSource,
          sourceLayer: foundSelectSource,
          id: foundSelectId,
        },
        { selected: true }
      );
    };

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/ckirby98/cm16u1uii005r01qkaqb42e2j",
      // center: [-75.2273, 40.071],
      trackResize: true,
      bounds: bounds,
    });

    const map = mapRef.current;
    const sourceLayers = features.map((f) => f.sourceLayer);

    map.on("load", () => {
      map.addControl(geocoder, "top-right");
      map.addControl(new NavigationControl());

      const sources = getSources(features);
      for (const source in sources) map.addSource(source, sources[source]);

      const layers = getLayers(features, geoLevel, geoid);

      for (const layer in layers) {
        const beforeId =
          layers[layer].type === "fill" ? "waterway-shadow" : "road-label";
        map.addLayer(layers[layer], beforeId);
      }
    });

    map.on("mousemove", sourceLayers, hoverGeoFill);
    map.on("mouseleave", sourceLayers, leaveGeoFill);
    map.on("click", sourceLayers, handleClick);

    return () => {
      if (mapRef.current && mapContainerRef.current) {
        mapRef.current.remove();
        mapContainerRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    hoverRef.current = hover;
  }, [hover]);

  useEffect(() => {
    selectRef.current = select;
  }, [select]);

  return (
    <div className="w-full aspect-[3/2] shadow" ref={mapContainerRef}>
      {select?.properties && (
        <SelectionPopup
          properties={select.properties}
          handleClose={removeSelection}
          handleFlyTo={flyToSelect}
        />
      )}
      <Legend features={features} legendOverride={legendOverride} />
    </div>
  );
}
