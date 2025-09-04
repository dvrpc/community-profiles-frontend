"use client"

import { parseBounds } from "@/lib/utils";
import mapboxgl, { Map, ColorSpecification, DataDrivenPropertyValueSpecification, FilterSpecification } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import getSources from "./mapSources";
import getLayers from "./mapLayers";
import { GeoLevel } from "@/types";

export interface Feature {
    sourceUrl: string;
    sourceLayer: string;
    geometry: 'Point' | 'Line' | 'Polygon';
    baseColor?: string;
    filter?: FilterSpecification;
    colorExpression?: DataDrivenPropertyValueSpecification<ColorSpecification>
}

interface Props {
    features: Feature[];
    buffer_box: string;
    geoLevel: GeoLevel;
    geoid: string;
}


export default function VizMap(props: Props) {
    const [hoverId, _setHoverId] = useState<string>("");
    const { features, buffer_box, geoLevel, geoid } = props;

    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map>(null);
    const hoverIdRef = useRef(hoverId);
    const bounds = parseBounds(buffer_box)


    const setHoverId = (id: string) => {
        hoverIdRef.current = id;
        _setHoverId(id);
    };

    const hoverGeoFill = (e: MouseEvent) => {

    };

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    const leaveGeoFill = () => {

    };

    const handleClick = (e: MouseEvent) => {

    };

    useEffect(() => {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

        if (mapContainer.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/ckirby98/cm16u1uii005r01qkaqb42e2j",
                // center: [-75.2273, 40.071],
                trackResize: true,
                bounds: bounds,
            });

            const map = mapRef.current;

            map.on("load", () => {
                const sources = getSources(features)
                const sourceLayers = features.map(f => f.sourceLayer)
                for (const source in sources) map.addSource(source, sources[source]);

                let layers = getLayers(features, geoLevel, geoid);

                for (const layer in layers) {
                    const beforeId =
                        layers[layer].type === "fill" ? "waterway-shadow" : "road-label";
                    map.addLayer(layers[layer], beforeId);
                }

                // map.on(
                //     "mousemove",
                //     sourceLayers,
                //     hoverGeoFill
                // );
                // map.on(
                //     "mouseleave",
                //     sourceLayers,
                //     leaveGeoFill
                // );
                // map.on("click", sourceLayers, handleClick);

            });

            return () => map.remove();
        }
    }, []);

    return (
        <div
            className="w-full h-full"
            ref={mapContainer}
        />
    );
}
