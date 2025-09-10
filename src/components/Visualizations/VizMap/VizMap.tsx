"use client";

import { parseBounds } from "@/lib/utils";
import mapboxgl, { Map, NavigationControl } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import getSources from "./mapSources";
import getLayers from "./mapLayers";
import { GeoLevel, Feature, MouseEvent, GeoJSONProperties } from "@/types";
import { ACCESS_TOKEN } from "@/consts";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import SelectionPopup from "./SelectionPopup";

interface Props {
  features: Feature[];
  buffer_box: string;
  geoLevel: GeoLevel;
  geoid: string;
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

interface HoverObject {
  id: string;
  source: string;
}

type SelectObject = HoverObject & {
  properties: GeoJSONProperties | null;
};

export default function VizMap(props: Props) {
  const [hover, setHover] = useState<HoverObject | null>(null);
  const [select, setSelect] = useState<SelectObject | null>(null);

  const { features, buffer_box, geoLevel, geoid } = props;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>(null);
  const hoverRef = useRef<HoverObject | null>(null);
  const selectRef = useRef<SelectObject | null>(null);

  const bounds = parseBounds(buffer_box);

  const hoverGeoFill = (e: MouseEvent) => {
    if (!e.features) return;
    const map = mapRef.current;
    if (!map) return;
    map.getCanvas().style.cursor = "pointer";

    const topSource = e.features[0].source;

    if (topSource) {
      if (hoverRef.current?.source) {
        map.setFeatureState(
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

      map.setFeatureState(
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
    const map = mapRef.current;
    if (!map) return;

    map.getCanvas().style.cursor = "";

    if (hoverRef.current) {
      map.setFeatureState(
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
    const map = mapRef.current;
    if (!map || !e.features) return;

    if (selectRef.current) {
      map.setFeatureState(
        {
          source: selectRef.current.source,
          sourceLayer: selectRef.current.source,
          id: selectRef.current.id,
        },
        { selected: false }
      );
    }
    const foundSelectId = e.features[0].id + "";
    const foundSelectSource = e.features[0].source + "";
    const foundProperties = e.features[0].properties;

    setSelect({
      id: foundSelectId,
      source: foundSelectSource,
      properties: foundProperties,
    });

    map.setFeatureState(
      {
        source: foundSelectSource,
        sourceLayer: foundSelectSource,
        id: foundSelectId,
      },
      { selected: true }
    );

    e.features[0].properties;
    // setAttributeTable(e);
  };

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/ckirby98/cm16u1uii005r01qkaqb42e2j",
        // center: [-75.2273, 40.071],
        trackResize: true,
        bounds: bounds,
      });

      const map = mapRef.current;

      map.on("load", () => {
        map.addControl(geocoder, "top-right");
        map.addControl(new NavigationControl());

        const sources = getSources(features);
        const sourceLayers = features.map((f) => f.sourceLayer);
        for (const source in sources) map.addSource(source, sources[source]);

        let layers = getLayers(features, geoLevel, geoid);

        for (const layer in layers) {
          const beforeId =
            layers[layer].type === "fill" ? "waterway-shadow" : "road-label";
          map.addLayer(layers[layer], beforeId);
        }

        map.on("mousemove", sourceLayers, hoverGeoFill);
        map.on("mouseleave", sourceLayers, leaveGeoFill);
        map.on("click", sourceLayers, handleClick);
      });

      return () => {
        map.remove();
      };
    }
  }, []);

  useEffect(() => {
    hoverRef.current = hover;
  }, [hover]);

  useEffect(() => {
    selectRef.current = select;
  }, [select]);

  return (
    <div className="w-full h-full" ref={mapContainerRef}>
      {select?.properties && (
        <SelectionPopup
          properties={select.properties}
          handleClose={() => setSelect(null)}
        />
      )}
    </div>
  );
}
