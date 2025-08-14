import { LayerMap } from "@/types";

const layers: LayerMap = {
  countyOutline: {
    id: "county-outline",
    type: "line",
    source: "countyBoundaries",
    "source-layer": "countyboundaries",
    paint: {
      "line-width": 2.5,
      "line-color": "#505a5e",
    },
    filter: ["==", "dvrpc_reg", "Yes"],
  },
  countyMask: {
    id: "county-mask",
    type: "fill",
    source: "countyBoundaries",
    "source-layer": "countyboundaries",
    paint: {
      "fill-color": "white",
      "fill-opacity": 0.8,
    },
    filter: ["==", "dvrpc_reg", "No"],
  },
};

export default layers;
