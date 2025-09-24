import { CategoryKeys, GeoLevel, SubcategoryContent, TopicContent } from "@/types";
import Topic from "./Topic";
import { displaySubcategoryTopicTitle } from "@/lib/utils";

interface Props {
    subcategory: string;
    topics: TopicContent[];
    category: CategoryKeys;
    geoid: string;
    buffer_bbox: string;
    geoLevel: GeoLevel;
}
export default function Subcategory(props: Props) {
    const { subcategory, topics, category, geoid, buffer_bbox, geoLevel } = props
    return (
        <div>
            <h3 className="text-3xl">{displaySubcategoryTopicTitle(subcategory)}</h3>
            {topics.map(t => <Topic key={`${subcategory}-${t.name}`} name={t.name} content={t.content} category={category} subcategory={subcategory} geoid={geoid} buffer_bbox={buffer_bbox} geoLevel={geoLevel} />)}
        </div>

    )
}