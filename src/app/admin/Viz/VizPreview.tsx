import VegaChart from "@/components/Visualizations/Chart/VegaChart";
import VizMap from "@/components/Visualizations/VizMap/VizMap";
import { GeoLevel, VizFile } from "@/types/types";

interface Props {
  id?: number;
  visualization: VizFile | null;
  geoLevel: GeoLevel;
  geoid: string;
  buffer_bbox: string;
}

export default function VizPreview(props: Props) {
  const { visualization, buffer_bbox, geoLevel, geoid, id } = props;

  function getViz(viz: VizFile, i: number) {
    console.log("viz", viz);
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

  if (!visualization) {
    return null;
  }

  return <div className="relative">{getViz(visualization, id ?? 0)}</div>;
}
