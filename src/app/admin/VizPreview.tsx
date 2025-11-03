import VegaChart from "@/components/Visualizations/Chart/VegaChart";
import VizMap from "@/components/Visualizations/VizMap/VizMap";
import { GeoLevel, Visualization } from "@/types";

interface Props {
  visualizations: Visualization[];
  geoLevel: GeoLevel;
  geoid: string;
  buffer_bbox: string;
}
export default function VizPreview(props: Props) {
  const { visualizations, buffer_bbox, geoLevel, geoid } = props;

  console.log("rendering viz");
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

  return (
    <div className="relative w-4/5 h-60 m-auto">
      {visualizations && visualizations.map((viz, i) => getViz(viz, i))}
    </div>
  );
}
