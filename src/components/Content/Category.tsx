import { categoryTitleMap } from "@/consts";
import {
  Category as CategoryType,
  CategoryKeys,
  ProfileBundle,
} from "@/types/types";
import Subcategory from "./Subcategory";
import Title from "./Title";

interface Props {
  category: CategoryType;
}

export default function Category(props: Props & ProfileBundle) {
  const { category, ...profileBundle } = props;

  const geoLevel = profileBundle.geoLevel;
  const profileData = profileBundle.profileData;

  console.log(category.content);
  return (
    <div className="p-16">
      <Title
        title={category.label}
        urlId={category.url_id}
        type="h2"
        categoryId={category.id}
        subcategoryId={0}
      />
      <div
        className="max-w-6xl columns-2xs gap-x-5 m-auto"
        dangerouslySetInnerHTML={{ __html: category.content }}
      ></div>

      <div>
        {category.subcategories.map((subcat) => (
          <Subcategory
            key={subcat.id}
            subcategory={subcat}
            geoid={profileData.geography.geoid}
            buffer_bbox={profileData.geography.buffer_bbox}
            geoLevel={geoLevel}
          />
        ))}
      </div>
    </div>
  );
}
