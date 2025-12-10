"use client";

import { useAllProducts, useSource } from "@/lib/hooks";
import { TopicPropertyForm, SelectOption, Source } from "@/types/types";
import MultiSelect from "./MultiSelect";
import { useState, useMemo, useEffect } from "react";
import Button from "@/components/Buttons/Button";
import { diff } from "@/lib/utils";

interface Props {
  id: number;
  topic_id: number;
  initialData: TopicPropertyForm;
  handleSave: (
    id: number,
    topic_id: number,
    payload: Partial<TopicPropertyForm>
  ) => void;
}

const mapIdsToOptions = <
  T extends {
    id: string | number;
    citation?: string;
    title?: string;
    link?: string;
  }
>(
  ids: number[] | string[],
  list: T[],
  labelKey: "citation" | "title" | "link"
): SelectOption[] => {
  return ids
    .map((id) => {
      const item = list.find((x) => x.id === id);
      if (!item) return null;
      return { value: id, label: item[labelKey] ?? "" };
    })
    .filter(Boolean) as SelectOption[];
};

const getCitationString = (
  selectedSources: SelectOption[],
  sources: Source[]
) => {
  const selectedIds = new Set(selectedSources.map((s) => s.value));
  const filtered = sources.filter((s) => selectedIds.has(s.id));
  return filtered
    .map((s, i) => s.citation + (i < filtered.length - 1 ? ", " : "."))
    .join("");
};

export default function TopicPropertiesForm(props: Props) {
  const { id, topic_id, initialData, handleSave } = props;
  const { data: sources } = useSource();
  const { data: products } = useAllProducts();

  const selectedContentSourcesOptions = useMemo(() => {
    if (!sources) return [];
    return mapIdsToOptions(initialData.content_sources, sources, "citation");
  }, [initialData.content_sources, sources]);

  const selectedVizSourcesOptions = useMemo(() => {
    if (!sources) return [];
    return mapIdsToOptions(initialData.viz_sources, sources, "citation");
  }, [initialData.viz_sources, sources]);

  const selectedProductsOptions = useMemo(() => {
    if (!products) return [];
    return mapIdsToOptions(initialData.related_products, products, "title");
  }, [initialData.related_products, products]);

  const [selectedContentSources, setSelectedContentSources] = useState<
    SelectOption[]
  >(selectedContentSourcesOptions);
  const [selectedVizSources, setSelectedVizSources] = useState<SelectOption[]>(
    selectedVizSourcesOptions
  );
  const [selectedProducts, setSelectedProducts] = useState<SelectOption[]>(
    selectedProductsOptions
  );

  const [isVisible, setIsVisible] = useState(initialData.is_visible);

  const [label, setLabel] = useState(initialData.label);
  const [catalogLinks, setCatalogLinks] = useState(initialData.catalog_links);
  const [censusLinks, setCensusLinks] = useState(initialData.census_links);
  const [otherLinks, setOtherLinks] = useState(initialData.other_links);
  const [sortWeight, setSortWeight] = useState(initialData.sort_weight);

  useEffect(() => {
    setLabel(initialData.label);
    setSelectedContentSources(selectedContentSourcesOptions);
    setSelectedVizSources(selectedVizSourcesOptions);
    setSelectedProducts(selectedProductsOptions);
    setIsVisible(initialData.is_visible);
    setCatalogLinks(initialData.catalog_links);
    setCensusLinks(initialData.census_links);
    setOtherLinks(initialData.other_links);
    setSortWeight(initialData.sort_weight);
  }, [
    id,
    selectedContentSourcesOptions,
    selectedVizSourcesOptions,
    selectedProductsOptions,
  ]);

  if (!sources || !products) return <div>Loading...</div>;

  const sourceOptions = sources.map((s) => ({
    value: s.id,
    label: s.citation,
  }));
  const productOptions = products.map((p) => ({ value: p.id, label: p.title }));

  const handleSaveClick = () => {
    const current: TopicPropertyForm = {
      label: label,
      sort_weight: sortWeight,
      content_sources: selectedContentSources.map((s) => Number(s.value)),
      viz_sources: selectedVizSources.map((v) => Number(v.value)),
      related_products: selectedProducts.map((p) => String(p.value)),
      is_visible: isVisible,
      catalog_links: catalogLinks,
      census_links: censusLinks,
      other_links: otherLinks,
    };

    const changedPayload = diff(initialData, current);

    if (Object.keys(changedPayload).length === 0) {
      alert("No changes detected.");
      return;
    }

    handleSave(id, topic_id, changedPayload);
  };

  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="w-100 flex flex-col gap-1">
          <label className="font-medium">Topic Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="border border-dvrpc-gray-5  p-2 rounded"
          />
        </div>
        <div className="w-100 flex flex-col gap-1">
          <label className="font-medium">Sort Weight</label>
          <input
            type="number"
            value={sortWeight}
            onChange={(e) => setSortWeight(parseInt(e.target.value))}
            className="border border-dvrpc-gray-5  p-2 rounded"
          />
        </div>
        <div className="w-100">
          <label className="font-medium">Sources</label>
          <MultiSelect
            value={selectedContentSources}
            options={sourceOptions}
            onChange={(vals) => setSelectedContentSources([...vals])}
          />
          <span className="italic text-sm">
            {getCitationString(selectedContentSources, sources)}
          </span>
        </div>

        <div className="w-100">
          <label className="font-medium">Viz Sources</label>
          <MultiSelect
            value={selectedVizSources}
            options={sourceOptions}
            onChange={(vals) => setSelectedVizSources([...vals])}
          />
          <span className="italic text-sm">
            {getCitationString(selectedVizSources, sources)}
          </span>
        </div>

        <div className="w-100">
          <label className="font-medium">Related Products</label>
          <MultiSelect
            value={selectedProducts}
            options={productOptions}
            onChange={(vals) => setSelectedProducts([...vals])}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium">Visible</label>
          <input
            type="checkbox"
            checked={isVisible}
            onChange={() => setIsVisible(!isVisible)}
            className="h-5 w-5"
          />
        </div>
        <div className="w-100">
          <label className="font-medium">Catalog Links</label>
        </div>
        {/* <div className="w-100 flex flex-col gap-1">
          <label className="font-medium">Data Catalog Link</label>
          <input
            type="text"
            value={dataCatalogLink}
            onChange={(e) => setDataCatalogLink(e.target.value)}
            className="border border-dvrpc-gray-5  p-2 rounded"
            placeholder="https://..."
          />
        </div>

        <div className="w-100 flex flex-col gap-1">
          <label className="font-medium">Census Link</label>
          <input
            type="text"
            value={censusLink}
            onChange={(e) => setCensusLink(e.target.value)}
            className="border border-dvrpc-gray-5 p-2 rounded"
            placeholder="https://..."
          />
        </div> */}
      </div>

      <div className="mt-4">
        <Button type="primary" handleClick={handleSaveClick}>
          Save
        </Button>
      </div>
    </form>
  );
}
