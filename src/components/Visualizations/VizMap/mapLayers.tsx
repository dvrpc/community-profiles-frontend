import { Feature, GeoLevel, LayerMap } from "@/types";
import {
  DataDrivenPropertyValueSpecification,
  LayerSpecification,
} from "mapbox-gl";
import { getCountyFromGeoid } from "@/utils";

export const defaultColor = "#0078AE";
const defaultFillAccent = "#87B5D6";

export default function getLayers(
  features: Feature[],
  geoLevel: GeoLevel,
  geoid: string
) {
  let layers: LayerMap = {};

  features.forEach((f) => {
    if (f.geometry == "Point")
      layers[f.sourceLayer + "-point"] = { ...layers, ...getPointLayer(f) };
    if (f.geometry == "Line")
      layers[f.sourceLayer + "-line"] = { ...layers, ...getLineLayer(f) };
    if (f.geometry == "Polygon") layers = { ...layers, ...getFillLayers(f) };
  });

  const boundaryLayers: LayerMap =
    geoLevel == "county"
      ? getCountyLayers(geoid)
      : getMunicipalityLayers(geoid);

  return { ...layers, ...boundaryLayers };
}

function getPointLayer(feature: Feature) {
  let color: string | DataDrivenPropertyValueSpecification<string> =
    feature.color ? feature.color : defaultColor;
  if (feature.colorExpression) color = feature.colorExpression;

  const layer: LayerSpecification = {
    id: feature.sourceLayer,
    source: feature.sourceLayer,
    "source-layer": feature.sourceLayer,
    type: "circle",
    paint: {
      "circle-color": color,
      "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "#fff",
        ["boolean", ["feature-state", "selected"], false],
        "#fff",
        color,
      ],
      "circle-stroke-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        3,
        ["boolean", ["feature-state", "selected"], false],
        3,
        0.5,
      ],
      "circle-radius": [
        "step",
        ["zoom"],
        [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          6,
          ["boolean", ["feature-state", "selected"], false],
          6,
          4,
        ],
        10,
        [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          7,
          ["boolean", ["feature-state", "selected"], false],
          7,
          4,
        ],
        13,
        [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          10,
          ["boolean", ["feature-state", "selected"], false],
          10,
          6,
        ],
      ],
    },
  };

  return layer;
}

function getLineLayer(feature: Feature) {
  let color: string | DataDrivenPropertyValueSpecification<string> =
    feature.color ? feature.color : defaultColor;
  if (feature.colorExpression) color = feature.colorExpression;

  const layer: LayerSpecification = {
    id: feature.sourceLayer,
    source: feature.sourceLayer,
    "source-layer": feature.sourceLayer,
    type: "line",
    paint: {
      "line-width": ["step", ["zoom"], 2, 10, 3, 13, 4],
      "line-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "#ff0000",
        ["boolean", ["feature-state", "selected"], false],
        "#ff0000",
        color,
      ],
    },
  };

  return layer;
}

function getFillLayers(feature: Feature) {
  let color: string | DataDrivenPropertyValueSpecification<string> =
    feature.color ? feature.color : defaultColor;
  if (feature.colorExpression) color = feature.colorExpression;

  //TODO: fill accent color
  const layers: LayerMap = {
    fillLayer: {
      id: feature.sourceLayer,
      source: feature.sourceLayer,
      "source-layer": feature.sourceLayer,
      type: "fill",
      paint: {
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          defaultFillAccent,
          ["boolean", ["feature-state", "selected"], false],
          defaultFillAccent,
          color,
        ],
        "fill-opacity": 0.8,
        // 'fill-outline': 'transparent'
      },
    },
    outlineLayer: {
      id: `${feature.sourceLayer}-outline`,
      type: "line",
      source: feature.sourceLayer,
      "source-layer": feature.sourceLayer,
      paint: {
        "line-color": "#fff",
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          3,
          ["boolean", ["feature-state", "selected"], false],
          3,
          0, //else
        ],
      },
    },
  };
  return layers;
}

function getCountyLayers(fips: string): LayerMap {
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
      filter: ["!=", "fips", fips],
    },
  };
}

function getMunicipalityLayers(geoid: string): LayerMap {
  const type = geoid.length == 5 ? "county" : "municipality";
  const co_name = getCountyFromGeoid(geoid);
  const municipalityFilter =
    type == "county" ? ["==", "co_name", co_name] : ["==", "dvrpc_reg", "Yes"];

  const municipalityLayers: LayerMap = {
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
    municipalityMask: {
      id: "municipality-mask",
      type: "fill",
      source: "municipalboundaries",
      "source-layer": "municipalboundaries",
      paint: {
        "fill-color": "white",
        "fill-opacity": 0.8,
      },
      filter: ["!=", "geoid", geoid],
    },
  };

  return municipalityLayers;
}
