"use client"

import { parseBounds } from "@/lib/utils";
import mapboxgl, { Map, NavigationControl } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import getSources from "./mapSources";
import getLayers from "./mapLayers";
import { GeoLevel, Feature } from "@/types";
import { ACCESS_TOKEN } from "@/consts";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';



interface Props {
    features: Feature[];
    buffer_box: string;
    geoLevel: GeoLevel;
    geoid: string;
}

mapboxgl.accessToken = ACCESS_TOKEN;

const geocoder = new MapboxGeocoder({
    accessToken: ACCESS_TOKEN,
    placeholder: 'Search to location',
    bbox: [-76.09405517578125, 39.49211914385648, -74.32525634765625, 40.614734298694216],
    marker: false,
});

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
                map.addControl(geocoder, 'top-right');
                map.addControl(new NavigationControl());

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
