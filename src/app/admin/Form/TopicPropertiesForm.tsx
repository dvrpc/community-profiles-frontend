"use client";

import { useAllLinks, useAllProducts, useSource } from "@/lib/hooks";
import { TopicPropertyForm, SelectOption, Source } from "@/types/types";
import MultiSelect from "./MultiSelect";
import { useState, useMemo, useEffect } from "react";
import Button from "@/components/Buttons/Button";
import { diff } from "@/lib/utils";
import LinkDropdown from "./CreateSelect";

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
  const { data: links } = useAllLinks();

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

  const selectedCatalogLinkOptions = useMemo(() => {
    if (!links) return [];
    const catalog_links = links.filter((l) => l.type == "catalog");
    return mapIdsToOptions(initialData.catalog_links, catalog_links, "link");
  }, [initialData.catalog_links, links]);

  const selectedCensusLinkOptions = useMemo(() => {
    if (!links) return [];
    const census_links = links.filter((l) => l.type == "census");
    return mapIdsToOptions(initialData.census_links, census_links, "link");
  }, [initialData.census_links, links]);

  const selectedOtherLinkOptions = useMemo(() => {
    if (!links) return [];
    const other_links = links.filter((l) => l.type == "other");
    return mapIdsToOptions(initialData.other_links, other_links, "link");
  }, [initialData.other_links, links]);

  const [selectedContentSources, setSelectedContentSources] = useState<
    SelectOption[]
  >(selectedContentSourcesOptions);
  const [selectedVizSources, setSelectedVizSources] = useState<SelectOption[]>(
    selectedVizSourcesOptions
  );
  const [selectedProducts, setSelectedProducts] = useState<SelectOption[]>(
    selectedProductsOptions
  );
  const [selectedCatalogLinks, setSelectedCatalogLinks] = useState<
    SelectOption[]
  >(selectedCatalogLinkOptions);
  const [selectedCensusLinks, setSelectedCensusLinks] = useState<
    SelectOption[]
  >(selectedCensusLinkOptions);
  const [selectedOtherLinks, setSelectedOtherLinks] = useState<SelectOption[]>(
    selectedCensusLinkOptions
  );
  const [isVisible, setIsVisible] = useState(initialData.is_visible);

  const [label, setLabel] = useState(initialData.label);
  const [sortWeight, setSortWeight] = useState(initialData.sort_weight);

  useEffect(() => {
    setLabel(initialData.label);
    setSelectedContentSources(selectedContentSourcesOptions);
    setSelectedVizSources(selectedVizSourcesOptions);
    setSelectedProducts(selectedProductsOptions);
    setIsVisible(initialData.is_visible);
    setSelectedCatalogLinks(selectedCatalogLinkOptions);
    setSelectedCensusLinks(selectedCensusLinkOptions);
    setSelectedOtherLinks(selectedOtherLinkOptions);
    setSortWeight(initialData.sort_weight);
  }, [
    id,
    selectedContentSourcesOptions,
    selectedVizSourcesOptions,
    selectedProductsOptions,
    selectedCatalogLinkOptions,
    selectedCensusLinkOptions,
    selectedOtherLinkOptions,
  ]);

  if (!sources || !products || !links) return <div>Loading...</div>;

  const sourceOptions = sources.map((s) => ({
    value: s.id,
    label: s.citation,
  }));
  const productOptions = products.map((p) => ({ value: p.id, label: p.title }));
  const catalogLinkOptions = links
    .filter((l) => l.type == "catalog")
    .map((l) => ({ value: l.id, label: l.link }));
  const censusLinkOptions = links
    .filter((l) => l.type == "census")
    .map((l) => ({ value: l.id, label: l.link }));
  const otherLinkOptions = links
    .filter((l) => l.type == "other")
    .map((l) => ({ value: l.id, label: l.link }));

  const handleSaveClick = () => {
    const current: TopicPropertyForm = {
      label: label,
      sort_weight: sortWeight,
      content_sources: selectedContentSources.map((s) => Number(s.value)),
      viz_sources: selectedVizSources.map((v) => Number(v.value)),
      related_products: selectedProducts.map((p) => String(p.value)),
      is_visible: isVisible,
      catalog_links: selectedCatalogLinks.map((l) => Number(l.value)),
      census_links: selectedCensusLinks.map((l) => Number(l.value)),
      other_links: selectedOtherLinks.map((l) => Number(l.value)),
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
          <LinkDropdown
            options={catalogLinkOptions}
            value={selectedCatalogLinks}
          />
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
