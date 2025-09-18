import { categoryTitleMap } from "@/consts";
import { CategoryKeys, GeoLevel, ProfileData, Visualization } from "@/types";
import VizMap from "../Visualizations/VizMap/VizMap";
import VegaChart from "../Visualizations/Chart/VegaChart";
import Visualizations from "../Visualizations/Vizualizations";

interface Props {
  category: CategoryKeys;
  content: string;
  profileData: ProfileData;
  geoLevel: GeoLevel;
}

export default function CategorySection(props: Props) {
  const { category, content, profileData, geoLevel } = props;

  return (
    <div className="p-16">
      <h2 id={category} className="text-4xl text-dvrpc-blue-1 font-bold mb-8">
        {categoryTitleMap[category]}
      </h2>
      <div className="flex">
        <div className="w-1/3">
          <div
            className="flex flex-col gap-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <div className="w-2/3 ml-16">
          <Visualizations
            category={category}
            geoLevel={geoLevel}
            geoid={profileData.geoid}
            buffer_bbox={profileData.buffer_bbox}
          />
        </div>
      </div>
    </div>
  );
}
