"use client";
import { useAllProducts, useSource } from "@/lib/hooks";
import { Source } from "@/types/types";
import MultiSelect from "./MultiSelect";
import { useState } from "react";
import Button from "@/components/Buttons/Button";

export interface Option {
  value: number;
  label: string;
}

interface Props {
  sources: Source[];
}

export default function PropertiesForm(props: Props) {
  const { data: sources } = useSource();
  const { data: products } = useAllProducts();

  const [selectedContentSources, setSelectedContentSources] = useState<
    Option[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<Option[]>([]);
  const [selectedVizSources, setSelectedVizSources] = useState<Option[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [dataCatalogLink, setDataCatalogLink] = useState<string>("");
  const [censusLink, setCensusLink] = useState<string>("");

  if (!sources || !products) return <></>;

  const sourceOptions: Option[] = sources.map((source) => ({
    value: source.id,
    label: source.name,
  }));

  const productOptions: Option[] = products.map((product) => ({
    value: product.id,
    label: product.title,
  }));

  const handleSourceChange = (values: readonly Option[]) => {
    setSelectedContentSources([...values]);
  };

  const handleProductChange = (values: readonly Option[]) => {
    setSelectedProducts([...values]);
  };

  const handleVizSourceChange = (values: readonly Option[]) => {
    setSelectedVizSources([...values]);
  };

  const handleSave = () => {
    const payload = {
      sources: selectedContentSources.map((s) => s.value),
      products: selectedProducts.map((p) => p.value),
      vizSources: selectedVizSources.map((v) => v.value),
      isVisible,
      dataCatalogLink,
      censusLink,
    };
  };

  const citationString = () => {
    if (!sources) return "";

    const sourceIds = selectedContentSources.map((s) => s.value);
    const selectedSourceIds = new Set(sourceIds);
    const filteredSources = sources.filter((source) =>
      selectedSourceIds.has(source.id)
    );
    return filteredSources
      .map((s, i) => s.citation + (i < filteredSources.length - 1 ? ", " : "."))
      .join("");
  };

  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="w-100">
          <label className="font-medium">Sources</label>
          <MultiSelect
            value={selectedContentSources}
            options={sourceOptions}
            onChange={handleSourceChange}
          />
          <span className="italic text-sm">{citationString()}</span>
        </div>

        <div className="w-100">
          <label className="font-medium">Viz Sources</label>
          <MultiSelect
            value={selectedVizSources}
            options={sourceOptions}
            onChange={handleVizSourceChange}
          />
        </div>

        <div className="w-100">
          <label className="font-medium">Related Products</label>
          <MultiSelect
            value={selectedProducts}
            options={productOptions}
            onChange={handleProductChange}
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

        <div className="w-100 flex flex-col gap-1">
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
        </div>
      </div>

      <div className="mt-4">
        <Button type="primary" handleClick={handleSave}>
          Save
        </Button>
      </div>
    </form>
  );
}
