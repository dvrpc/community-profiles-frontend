"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatBounds, Map } from "mapbox-gl";
import { REMAINING_VIEWPORT_HEIGHT_PROPERTY } from "@/consts";
import sources from "./mapSources";
import getLayers from "./mapLayers";
import { GeoLevel, MouseEvent } from "@/types";
import { useRouter } from "next/navigation";
import { count } from "console";
import { getMunicipalitySlugFromGeoid } from "@/lib/utils";

interface Props {
  buffer_box?: string;
  geoid?: string;
  geoLevel?: GeoLevel;
}

function parseBounds(buffer_box: string) {
  //POLYGON((-75.5172386174942 40.019966656385144,-75.52195819955206 40.635408512424895,-74.68232273049465 40.63615113388574,-74.68519528899041 40.020693387223744,-75.5172386174942 40.019966656385144))
  const allCoords = buffer_box.substring(9, buffer_box.length - 1).split(",");
  const sw = allCoords[0].split(" ").map(Number);
  const ne = allCoords[2].split(" ").map(Number);

  const swLngLat = {
    lng: sw[0],
    lat: sw[1],
  };

  const neLngLat = {
    lng: ne[0],
    lat: ne[1],
  };
  return new LngLatBounds(swLngLat, neLngLat);
}

const defaultBounds = new LngLatBounds(
  { lng: -76.09405517578125, lat: 39.49211914385648 },
  { lng: -74.32525634765625, lat: 40.614734298694216 }
);

export default function HeroMap(props: Props) {
  const [hoverId, _setHoverId] = useState<string>("");
  const router = useRouter();
  const { buffer_box, geoid, geoLevel } = props;

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>(null);
  const hoverIdRef = useRef(hoverId);

  const bounds = buffer_box ? parseBounds(buffer_box) : defaultBounds;
  const hoverSource =
    geoLevel == "county" ? "municipalboundaries" : "countyboundaries";
  // ref required for hoverId as mounting/unmounting hover events is too slow for fast mouse movement
  const setHoverId = (id: string) => {
    hoverIdRef.current = id;
    _setHoverId(id);
  };

  const hoverGeoFill = (e: MouseEvent) => {
    if (!e.features) return;
    const map = mapRef.current;
    if (!map) return;

    const hoverId = hoverIdRef.current;

    const topSource = e.features[0].source;

    console.log(topSource);
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
    }
  };

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
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
  };

  const handleClick = (e: MouseEvent) => {
    if (!e.features) return;
    const selectedFeature = e.features[0];
    const source = selectedFeature.source;

    if (!selectedFeature.properties) return;

    const county: string = selectedFeature.properties["co_name"].toLowerCase();

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

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (mapContainer.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/ckirby98/cm16u1uii005r01qkaqb42e2j",
        // center: [-75.2273, 40.071],
        trackResize: true,
        scrollZoom: false,
        dragPan: false,
        bounds: bounds,
        interactive: false,
      });

      const map = mapRef.current;

      map.on("load", () => {
        for (const source in sources) map.addSource(source, sources[source]);

        let layers = getLayers(geoid, geoLevel);

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
