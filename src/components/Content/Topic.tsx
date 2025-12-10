import { CategoryKeys, GeoLevel } from "@/types/types";
import Visualizations from "../Visualizations/Vizualizations";
import { displaySubcategoryTopicTitle } from "@/utils";
import RelatedProducts from "./RelatedProducts";
import { QueryClientProvider } from "@tanstack/react-query";
import { Share2, ShoppingCart, Sheet } from "lucide-react";

interface Props {
  id: number;
  name: string;
  label: string;
  content: string;
  citations: string[];
  category: CategoryKeys;
  subcategory: string;
  geoid: string;
  buffer_bbox: string;
  geoLevel: GeoLevel;
  relatedProducts: string[];
  censusLinks: string[];
  catalogLinks: string[];
}

export default function Topic(props: Props) {
  const {
    id,
    name,
    label,
    content,
    category,
    citations,
    subcategory,
    geoid,
    buffer_bbox,
    geoLevel,
    relatedProducts,
    censusLinks,
    catalogLinks,
  } = props;
  return (
    <div className="py-6">
      <div className="flex justify-between mb-2">
        <h4 id={`${subcategory}-${name}`} className="text-2xl scroll-mt-32">
          {label}
        </h4>
        <div className="flex gap-4 text-dvrpc-gray-3 text-sm">
          <button className="flex gap-2 items-center hover:cursor-pointer hover:text-dvrpc-blue-1">
            <ShoppingCart size={20} />
            Add Data to Cart
          </button>
          {censusLinks && (
            <button className="flex gap-2 items-center hover:cursor-pointer hover:text-dvrpc-blue-1">
              <Sheet size={20} />
              View Census Table
            </button>
          )}
          {catalogLinks && (
            <button className="flex gap-2 items-center hover:cursor-pointer hover:text-dvrpc-blue-1">
              <Sheet size={20} />
              View in Data Catalog
            </button>
          )}
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
