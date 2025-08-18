"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect } from "react";
import mapboxgl, { LngLatBounds } from "mapbox-gl";
import {
  REMAINING_VIEWPORT_HEIGHT_PROPERTY,
} from "@/consts";
import sources from "./mapSources";
import getLayers from "./mapLayers";

interface Props {
  buffer_box?: string;
  fips?: string;
}

function parseBounds(buffer_box: string) {
  //POLYGON((-75.5172386174942 40.019966656385144,-75.52195819955206 40.635408512424895,-74.68232273049465 40.63615113388574,-74.68519528899041 40.020693387223744,-75.5172386174942 40.019966656385144))
  const allCoords = buffer_box.substring(9, buffer_box.length - 1).split(',')
  const sw = allCoords[0].split(' ').map(Number)
  const ne = allCoords[2].split(' ').map(Number)

  const swLngLat = {
    lng: sw[0],
    lat: sw[1]
  }

  const neLngLat = {
    lng: ne[0],
    lat: ne[1]
  }
  return new LngLatBounds(swLngLat, neLngLat)
}

const defaultBounds = new LngLatBounds(
  { lng: -76.09405517578125, lat: 39.49211914385648 },
  { lng: -74.32525634765625, lat: 40.614734298694216 }
)


export default function HeroMap(props: Props) {
  const { buffer_box, fips } = props;

  const bounds = buffer_box ? parseBounds(buffer_box) : defaultBounds

  const mapContainer = useRef<HTMLDivElement>(null);

  console.log(fips)
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
        bounds: bounds
      });
      map.on("load", () => {
        for (const source in sources) map.addSource(source, sources[source]);

        const layers = getLayers(fips)
        for (const layer in layers) {
          const beforeId =
            layers[layer].type === "fill" ? "waterway-shadow" : "road-label";
          map.addLayer(layers[layer], beforeId);
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
