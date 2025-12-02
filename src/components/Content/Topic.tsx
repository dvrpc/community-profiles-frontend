import { CategoryKeys, GeoLevel } from "@/types/types";
import Visualizations from "../Visualizations/Vizualizations";
import { displaySubcategoryTopicTitle } from "@/utils";

interface Props {
  id: number;
  name: string;
  content: string;
  category: CategoryKeys;
  subcategory: string;
  geoid: string;
  buffer_bbox: string;
  geoLevel: GeoLevel;
}


export default function Topic(props: Props) {
  const { id, name, content, category, subcategory, geoid, buffer_bbox, geoLevel } =
    props;
  return (
    <div className="py-6">
      <h4 id={`${subcategory}-${name}`} className="text-2xl scroll-mt-32">
        {displaySubcategoryTopicTitle(name)}
      </h4>
      <div className="flex flex-row ">
        <div
          className="w-1/3 flex flex-col gap-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="w-2/3 ml-16">
          <Visualizations
            id={id}
            category={category}
            subcategory={subcategory}
            topic={name}
            geoLevel={geoLevel}
            geoid={geoid}
            buffer_bbox={buffer_bbox}
          />
        </div>
      </div>
    </div>
  );
}
