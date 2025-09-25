import { categoryTitleMap } from "@/consts";
import {
  CategoryKeys,
  GeoLevel,
  ProfileData,
  SubcategoryContent,
  Visualization,
} from "@/types";
import VizMap from "../Visualizations/VizMap/VizMap";
import VegaChart from "../Visualizations/Chart/VegaChart";
import Visualizations from "../Visualizations/Vizualizations";
import Subcategory from "./Subcategory";
import ScrollNode from "./ScrollNode";
import Title from "./Title";

interface Props {
  category: CategoryKeys;
  subcategories: SubcategoryContent;
  // content: string;
  profileData: ProfileData;
  geoLevel: GeoLevel;
}

export default function Category(props: Props) {
  const { category, subcategories, profileData, geoLevel } = props;

  return (
    <div className="p-16">
      <ScrollNode key={category} level="category" />
      <Title
        title={categoryTitleMap[category]}
        type="h2"
        category={category}
        subcategory=""
      />

      <div>
        {Object.entries(subcategories).map(([key, value]) => (
          <Subcategory
            key={category + key}
            subcategory={key}
            topics={value}
            category={category}
            geoid={profileData.geoid}
            buffer_bbox={profileData.buffer_bbox}
            geoLevel={geoLevel}
          />
        ))}
      </div>
    </div>
  );
}
