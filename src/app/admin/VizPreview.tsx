import VegaChart from "@/components/Visualizations/Chart/VegaChart";
import VizMap from "@/components/Visualizations/VizMap/VizMap";
import { Visualization } from "@/types";

interface Props {
  visualizations: Visualization[];
}
export default function VizPreview(props: Props) {
  const { visualizations } = props;
  function getViz(viz: Visualization, i: number) {
    // if (viz.type == "map") {
    //   return (
    //     <VizMap
    //       key={i}
    //       features={viz.features}
    //       legendOverride={viz.legendOverride}
    //       buffer_box={buffer_bbox}
    //       geoLevel={geoLevel}
    //       geoid={geoid}
    //     />
    //   );
    // }
    if (viz.type == "chart") {
      return <VegaChart key={i} spec={viz.schema} />;
    }
  }

  return (
    <div>
      {visualizations && visualizations.map((viz, i) => getViz(viz, i))}
    </div>
  );
}
