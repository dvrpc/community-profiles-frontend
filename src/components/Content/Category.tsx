import { categoryTitleMap, regionBounds } from "@/consts";
import {
  CategoryKeys,
  GeoLevel,
  ProfileData,
  SubcategoryContent,
} from "@/types/types";
import Subcategory from "./Subcategory";
import Title from "./Title";

interface Props {
  category: CategoryKeys;
  subcategories: SubcategoryContent;
  profileData: ProfileData;
  geoLevel: GeoLevel;
}


export default function Category(props: Props) {
  const { category, subcategories, profileData, geoLevel } = props;


  return (
    <div className="p-16">
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
