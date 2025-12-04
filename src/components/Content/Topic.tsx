import { CategoryKeys, GeoLevel } from "@/types/types";
import Visualizations from "../Visualizations/Vizualizations";
import { displaySubcategoryTopicTitle } from "@/utils";
import RelatedProducts from "./RelatedProducts";
import { QueryClientProvider } from "@tanstack/react-query";

interface Props {
  id: number;
  name: string;
  content: string;
  citations: string[];
  category: CategoryKeys;
  subcategory: string;
  geoid: string;
  buffer_bbox: string;
  geoLevel: GeoLevel;
  relatedProducts: string[];
}

export default function Topic(props: Props) {
  const {
    id,
    name,
    content,
    category,
    citations,
    subcategory,
    geoid,
    buffer_bbox,
    geoLevel,
    relatedProducts,
  } = props;
  return (
    <div className="py-6">
      <h4 id={`${subcategory}-${name}`} className="text-2xl scroll-mt-32">
        {displaySubcategoryTopicTitle(name)}
      </h4>
      <div className="flex flex-row ">
        <div className="w-1/3 flex flex-col gap-4">
          <div
            className="flex flex-col gap-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {citations.length > 0 && (
            <p className="text-sm italic">{citations.join(". ")}</p>
          )}
          {relatedProducts.length > 0 && (
            <RelatedProducts relatedProducts={relatedProducts} />
          )}
        </div>

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
