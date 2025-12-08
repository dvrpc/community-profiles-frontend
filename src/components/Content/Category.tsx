import { categoryTitleMap } from "@/consts";
import {
  CategoryContent,
  CategoryKeys,
  GeoLevel,
  ProfileData,
} from "@/types/types";
import Subcategory from "./Subcategory";
import Title from "./Title";

interface Props {
  category: CategoryKeys;
  categoryContent: CategoryContent;
  profileData: ProfileData;
  geoLevel: GeoLevel;
}

export default function Category(props: Props) {
  const { category, categoryContent, profileData, geoLevel } = props;

  return (
    <div className="p-16">
      <Title
        title={categoryTitleMap[category]}
        type="h2"
        category={category}
        subcategory=""
      />
      <div
        className="max-w-6xl columns-2xs gap-x-5 m-auto"
        dangerouslySetInnerHTML={{ __html: categoryContent?.content }}
      ></div>

      <div>
        {categoryContent.subcategories.map(subcat => (
          <Subcategory
            key={subcat.id}
            subcategory={subcat.name}
            label={subcat.label}
            topics={subcat.topics}
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
