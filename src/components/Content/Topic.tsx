import { Topic as TopicType, GeoLevel } from "@/types/types";
import Visualizations from "../Visualizations/Vizualizations";
import RelatedProducts from "./RelatedProducts";
import { Share2, ShoppingCart, Sheet } from "lucide-react";
import LinkButton from "../Buttons/LinkButton";
import AddDataToCartButton from "../DataCart/AddDataToCartButton";

interface Props {
  topic: TopicType;
  geoid: string;
  buffer_bbox: string;
  geoLevel: GeoLevel;
  subcategoryUrlId: string;
}

export default function Topic(props: Props) {
  const { topic, geoid, buffer_bbox, geoLevel, subcategoryUrlId } = props;

  const censusLinks = topic.links.filter((l) => l.type === "census");
  const catalogLinks = topic.links.filter((l) => l.type === "catalog");
  const otherLinks = topic.links.filter((l) => l.type === "other");
  return (
    <div className="py-6">
      <div className="flex justify-between mb-2">
        <h4
          id={`${subcategoryUrlId}-${topic.url_id}`}
          className="text-2xl scroll-mt-32"
        >
          {topic.label}
        </h4>
        <div className="flex gap-4 text-dvrpc-gray-3 text-sm">
          <AddDataToCartButton topicId={topic.id} topicVars={topic.variables} />

          <LinkButton
            label="View Census Table"
            links={censusLinks}
            icon={<Sheet size={20} />}
          />

          <LinkButton
            label="View in Data Catalog"
            links={catalogLinks}
            icon={<Sheet size={20} />}
          />

          <LinkButton
            label="Other Links"
            links={otherLinks}
            icon={<Sheet size={20} />}
          />

          <button className="flex gap-2 items-center hover:cursor-pointer hover:text-dvrpc-blue-1">
            <Share2 size={20} />
            Share
          </button>
        </div>
      </div>

      <div className="flex flex-row ">
        <div className="w-1/3 flex flex-col gap-4">
          <div
            className="flex flex-col gap-4"
            dangerouslySetInnerHTML={{ __html: topic.content }}
          />
          {topic.citations.length > 0 && (
            <p className="text-sm italic">{topic.citations.join(". ")}</p>
          )}
          {topic.products.length > 0 && (
            <RelatedProducts relatedProducts={topic.products} />
          )}
        </div>

        <div className="w-2/3 ml-16">
          <Visualizations
            topicId={topic.id}
            geoLevel={geoLevel}
            geoid={geoid}
            buffer_bbox={buffer_bbox}
          />
        </div>
      </div>
    </div>
  );
}
