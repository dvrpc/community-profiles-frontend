import {
  CategoryKeys,
  GeoLevel,
  SubcategoryContent,
  TopicContent,
} from "@/types";
import Topic from "./Topic";
import { displaySubcategoryTopicTitle } from "@/utils";
import Title from "./Title";

interface Props {
  subcategory: string;
  topics: TopicContent[];
  category: CategoryKeys;
  geoid: string;
  buffer_bbox: string;
  geoLevel: GeoLevel;
}
export default function Subcategory(props: Props) {
  const { subcategory, topics, category, geoid, buffer_bbox, geoLevel } = props;
  return (
    <div>
      <Title
        title={displaySubcategoryTopicTitle(subcategory)}
        type="h3"
        category={category}
        subcategory={subcategory}
      />
      {topics.map((t) => (
        <Topic
          key={`${subcategory}-${t.name}`}
          name={t.name}
          content={t.content}
          category={category}
          subcategory={subcategory}
          geoid={geoid}
          buffer_bbox={buffer_bbox}
          geoLevel={geoLevel}
        />
      ))}
    </div>
  );
}
