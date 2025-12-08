import { CategoryKeys, GeoLevel, TopicContent } from "@/types/types";
import Topic from "./Topic";
import { displaySubcategoryTopicTitle } from "@/utils";
import Title from "./Title";

interface Props {
  subcategory: string;
  label: string;
  topics: TopicContent[];
  category: CategoryKeys;
  geoid: string;
  buffer_bbox: string;
  geoLevel: GeoLevel;
}
export default function Subcategory(props: Props) {
  const { subcategory, label, topics, category, geoid, buffer_bbox, geoLevel } = props;
  return (
    <div>
      <Title
        title={label}
        type="h3"
        category={category}
        subcategory={subcategory}
      />
      {topics.map((t) => (
        <Topic
          key={`${subcategory}-${t.name}`}
          id={t.id}
          label={t.label}
          name={t.name}
          content={t.content}
          category={category}
          citations={t.citations}
          subcategory={subcategory}
          geoid={geoid}
          buffer_bbox={buffer_bbox}
          geoLevel={geoLevel}
          relatedProducts={t.related_products}
        />
      ))}
    </div>
  );
}
