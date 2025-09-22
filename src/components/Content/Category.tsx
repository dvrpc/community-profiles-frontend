import { categoryTitleMap } from "@/consts";
import { CategoryKeys, GeoLevel, ProfileData, SubcategoryContent, Visualization } from "@/types";
import VizMap from "../Visualizations/VizMap/VizMap";
import VegaChart from "../Visualizations/Chart/VegaChart";
import Visualizations from "../Visualizations/Vizualizations";
import Subcategory from "./Subcategory";

interface Props {
  category: CategoryKeys
  subcategories: SubcategoryContent;
  // content: string;
  profileData: ProfileData;
  geoLevel: GeoLevel;
}

export default function CategorySection(props: Props) {
  const { category, subcategories, profileData, geoLevel, } = props;

  return (
    <div className="p-16">
      <h2 id={category} className="text-4xl text-dvrpc-blue-1 font-bold mb-8 text-center">
        {categoryTitleMap[category]}
      </h2>
      <div >
        {Object.entries(subcategories).map(([key, value]) =>
          <Subcategory key={category + key} subcategory={key} topics={value} category={category} geoid={profileData.geoid} buffer_bbox={profileData.buffer_bbox} geoLevel={geoLevel} />)}
      </div>
    </div>
  );
}
