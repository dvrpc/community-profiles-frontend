"use client"

import { GeoLevel, Visualization } from "@/types";
import VizMap from "./VizMap/VizMap";
import VegaChart from "./Chart/VegaChart";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface Props {
    visualizations: Visualization[];
    geoLevel: GeoLevel;
    geoid: string;
    buffer_bbox: string
}

export default function Visualizations(props: Props) {
    const { visualizations, geoLevel, geoid, buffer_bbox } = props
    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
    });

    useEffect(() => {
        console.log('in view')
    }, [inView])

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
    return (<div ref={ref}>
        {visualizations && visualizations.map((viz, i) => getViz(viz, i))}
    </div>)
}