import { GeoLevel, LayerMap } from "@/types";
import { getCountyFromGeoid } from "@/lib/utils";

const defaultMaskFilter = ["==", "dvrpc_reg", "Yes"];

function getLayers(geoid?: string, geoLevel?: GeoLevel) {
  if (geoid) {
    if (geoLevel == "county") {
      //TODO: Add philadelphia planning districts
      if (geoid == "42101") {
        return getCountyLayers(geoid);
      }
      return { ...getCountyLayers(geoid), ...getMunicipalityLayers(geoid) };
    } else {
      return getMunicipalityLayers(geoid);
    }
  }

  return getCountyLayers();
}

function getCountyLayers(fips?: string): LayerMap {
  const maskFilter = fips ? ["!=", "fips", fips] : defaultMaskFilter;
  return {
    countyOutline: {
      id: "county-outline",
      type: "line",
      source: "countyboundaries",
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
      source: "countyboundaries",
      "source-layer": "countyboundaries",
      paint: {
        "fill-color": "white",
        "fill-opacity": 0.8,
      },
      filter: maskFilter,
    },
    countyFill: {
      id: "county-fill",
      type: "fill",
      source: "countyboundaries",
      "source-layer": "countyboundaries",
      paint: {
        "fill-color": "black",
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.2,
          0,
        ],
      },
      filter: ["==", "dvrpc_reg", "Yes"],
    },
  };
}

function getMunicipalityLayers(geoid: string): LayerMap {
  let type = geoid.length == 5 ? "county" : "municipality";
  const co_name = getCountyFromGeoid(geoid);
  let municipalityFilter =
    type == "county" ? ["==", "co_name", co_name] : ["==", "dvrpc_reg", "Yes"];

  let municipalityLayers: LayerMap = {
    municipalityOutline: {
      id: " municipality-outline",
      type: "line",
      source: "municipalboundaries",
      "source-layer": "municipalboundaries",
      paint: {
        "line-width": 2.5,
        "line-color": "#505a5e",
      },
      filter: municipalityFilter,
    },
    municipalityFill: {
      id: "municipality-fill",
      type: "fill",
      source: "municipalboundaries",
      "source-layer": "municipalboundaries",
      paint: {
        "fill-color": "black",
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.2,
          0,
        ],
      },
      filter: municipalityFilter,
    },
  };

  if (type == "municipality") {
    municipalityLayers["municipalityMask"] = {
      id: "municipality-mask",
      type: "fill",
      source: "municipalboundaries",
      "source-layer": "municipalboundaries",
      paint: {
        "fill-color": "white",
        "fill-opacity": 0.8,
      },
      filter: ["!=", "geoid", geoid],
    };
  }

  return municipalityLayers;
}

export default getLayers;
