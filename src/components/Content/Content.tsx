import {
  CategoryKeys,
  CountyData,
  GeoLevel,
  MunicipalityData,
  ProfileContent,
  ProfileData,
} from "@/types";
import CategorySection from "./Category";

interface Props {
  content: ProfileContent;
  data: ProfileData;
  geoLevel: GeoLevel;
}
export default function Content(props: Props) {
  const { content, data, geoLevel } = props;

  return (
    <div>
      {Object.entries(content).map(([key, value]) => {
        const category = key as CategoryKeys
        return (
          <CategorySection
            key={category}
            category={category}
            subcategories={value}
            profileData={data}
            geoLevel={geoLevel}
          />
        );
      })}
    </div>
  );
}
