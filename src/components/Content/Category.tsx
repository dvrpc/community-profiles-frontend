import { categoryTitleMap } from "@/consts";
import { CategoryContent, CategoryKeys, ProfileBundle } from "@/types/types";
import Subcategory from "./Subcategory";
import Title from "./Title";

interface Props {
  category: CategoryKeys;
  categoryContent: CategoryContent;
}

export default function Category(props: Props & ProfileBundle) {
  const { category, categoryContent, ...profileBundle } = props;

  const geoLevel = profileBundle.geoLevel;
  const profileData = profileBundle.profileData;
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
        {categoryContent.subcategories.map((subcat) => (
          <Subcategory
            key={subcat.id}
            subcategory={subcat.name}
            label={subcat.label}
            topics={subcat.topics}
            category={category}
            geoid={profileData.geography.geoid}
            buffer_bbox={profileData.geography.geoid}
            geoLevel={geoLevel}
          />
        ))}
      </div>
    </div>
  );
}
