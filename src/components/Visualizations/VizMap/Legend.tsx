import { Feature, LegendOverrideItem } from "@/types";
import { defaultColor } from "./mapLayers";

interface Props {
  features: Feature[];
  legendOverride?: LegendOverrideItem[];
}

const legendIconSize = 16;

export default function Legend(props: Props) {
  const { features, legendOverride } = props;

  function getLegendIcon(feature: Feature | LegendOverrideItem) {
    const color = feature.color ? feature.color : defaultColor;
    if (feature.geometry == "Point") {
      return (
        <circle
          cx={legendIconSize / 2}
          cy={legendIconSize / 2}
          r={legendIconSize / 2}
          fill={color}
        />
      );
    }
    if (feature.geometry == "Line") {
      return (
        <line
          className="stroke-2"
          x1="0"
          x2={legendIconSize}
          y1={legendIconSize / 2}
          y2={legendIconSize / 2}
          stroke={color}
        />
      );
    }
    if (feature.geometry == "Polygon") {
      return (
        <rect
          x="0"
          y="0"
          width={legendIconSize}
          height={legendIconSize}
          fill={color}
        />
      );
    }
  }

  const legendFeatures = legendOverride ? legendOverride : features;

  return (
    <div className="mt-2 absolute right-2 bottom-6 p-2 z-10 bg-white shadow rounded-md text-sm">
      {legendFeatures.map((f) => {
        return (
          <div key={f.label} className="flex items-center gap-2">
            <svg width={legendIconSize} height={legendIconSize}>
              {getLegendIcon(f)}
            </svg>
            <span>{f.label}</span>
          </div>
        );
      })}
    </div>
  );
}
