import { categoryTitleMap } from "@/consts";
import { CategoryKeys, GeoLevel, ProfileData, Visualization } from "@/types";
import VizMap from "../Visualizations/VizMap/VizMap";
import VegaChart from "../Visualizations/Chart/VegaChart";

interface Props {
  category: CategoryKeys;
  content: string;
  profileData: ProfileData;
  geoLevel: GeoLevel
  visualizations?: Visualization[];
}

export default function CategorySection(props: Props) {
  const { category, content, profileData, geoLevel, visualizations } = props;

  function getViz(viz: Visualization, i: number) {
    console.log(viz)
    if (viz.type == 'map') {
      return <VizMap key={i} features={viz.schema} buffer_box={profileData.buffer_bbox} geoLevel={geoLevel} geoid={profileData.geoid} />
    }
    if (viz.type == 'chart') {
      return <VegaChart key={i} spec={viz.schema} />
    }
  }

  return (
    <div className="p-16 flex">
      <div className="w-1/3">
        <h2 id={category} className="text-4xl text-dvrpc-blue-1 font-bold mb-8">
          {categoryTitleMap[category]}
        </h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <div className="w-2/3 ml-16">
        {visualizations && visualizations.map((viz, i) => getViz(viz, i))}
      </div>
    </div>
  );
}
