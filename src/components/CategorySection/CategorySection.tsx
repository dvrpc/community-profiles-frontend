import { categoryTitleMap } from "@/consts";
import { CategoryKeys, GeoLevel, ProfileData, Visualization } from "@/types";
import { JSX } from "react";
import VizMap from "../Visualizations/VizMap/VizMap";

interface Props {
  category: CategoryKeys;
  content: string;
  profileData: ProfileData;
  geoLevel: GeoLevel
  visualizations?: Visualization[];
}



export default function CategorySection(props: Props) {
  const { category, content, profileData, geoLevel, visualizations } = props;

  function getViz(viz: Visualization) {
    if (viz.type == 'map') {
      return <VizMap features={viz.data} buffer_box={profileData.buffer_bbox} geoLevel={geoLevel} geoid={profileData.geoid} />
    }
    if (viz.type == 'chart') {

    }
    return <></>
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
        {visualizations && visualizations.map(viz => getViz(viz))}
      </div>
    </div>
  );
}
