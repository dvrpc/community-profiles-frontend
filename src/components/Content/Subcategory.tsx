import { GeoLevel, Subcategory as SubcategoryType } from "@/types/types";
import Topic from "./Topic";
import Title from "./Title";

interface Props {
  subcategory: SubcategoryType;
  geoid: string;
  buffer_bbox: string;
  geoLevel: GeoLevel;
}

export default function Subcategory(props: Props) {
  const { subcategory, geoid, buffer_bbox, geoLevel } = props;
  return (
    <div>
      <Title
        title={subcategory.label}
        urlId={subcategory.url_id}
        type="h3"
        categoryId={subcategory.category_id}
        subcategoryId={subcategory.id}
      />
      {subcategory.topics.map((t) => (
        <Topic
          key={`${subcategory.url_id}-${t.url_id}`}
          topic={t}
          subcategoryUrlId={subcategory.url_id}
          geoid={geoid}
          buffer_bbox={buffer_bbox}
          geoLevel={geoLevel}
        />
      ))}
    </div>
  );
}
