"use client";

import {
  useAllProducts,
  useSource,
  useTopic,
  useUpdateTopic,
} from "@/lib/hooks";
import {
  Link,
  TopicLink,
  TopicPropertyForm,
  SelectOption,
  Source,
} from "@/types/types";
import MultiSelect from "./MultiSelect";
import { useState, useMemo, useEffect } from "react";
import Button from "@/components/Buttons/Button";
import { diff } from "@/lib/utils";
import { useAdminToast } from "../Toast/AdminToast";

interface Props {
  id: number;
}

const emptyTopic: TopicPropertyForm = {
  content_ids: [],
  product_ids: [],
  links: [],
  label: "",
  sort_weight: 0,
  is_visible: true,
};

type LinkRow = TopicLink;

const mapIdsToOptions = <T extends { id: string | number }>(
  ids: number[] | string[],
  list: T[],
  getLabel: (item: T) => string,
): SelectOption[] => {
  return ids.flatMap((id) => {
    const item = list.find((x) => x.id === id);
    return item ? [{ value: item.id, label: getLabel(item) }] : [];
  });
};

const getCitationString = (
  selectedSources: SelectOption[],
  sources: Source[],
) => {
  const selectedIds = new Set(selectedSources.map((s) => s.value));
  const filtered = sources.filter((s) => selectedIds.has(s.id));
  return filtered
    .map((s, i) => s.citation + (i < filtered.length - 1 ? ", " : "."))
    .join("");
};

export default function TopicPropertiesForm(props: Props) {
  const { id } = props;
  const { data: topic } = useTopic(id);
  const { data: sources } = useSource();
  const { data: products } = useAllProducts();
  const topicUpdateMutation = useUpdateTopic();
  const { showToast, showError } = useAdminToast();
  const initialData = topic ?? emptyTopic;

  const selectedContentSourcesOptions = useMemo(() => {
    if (!sources) return [];
    return mapIdsToOptions(
      initialData.content_ids ?? [],
      sources,
      (source) => source.citation,
    );
  }, [initialData.content_ids, sources]);

  const selectedProductsOptions = useMemo(() => {
    if (!products) return [];
    return mapIdsToOptions(
      initialData.product_ids ?? [],
      products,
      (product) => product.title,
    );
  }, [initialData.product_ids, products]);

  const [selectedContentSources, setSelectedContentSources] = useState<
    SelectOption[]
  >(selectedContentSourcesOptions);
  const [selectedProducts, setSelectedProducts] = useState<SelectOption[]>(
    selectedProductsOptions,
  );
  const [linkRows, setLinkRows] = useState<LinkRow[]>(
    (topic?.links ?? []).map((link) => ({ ...link, mutation: "none" })),
  );

  const [isVisible, setIsVisible] = useState(initialData.is_visible ?? true);

  const [label, setLabel] = useState(initialData.label ?? "");
  const [urlId, setUrlId] = useState(initialData.url_id ?? "");
  const [sortWeight, setSortWeight] = useState(initialData.sort_weight ?? 0);

  useEffect(() => {
    setLabel(initialData.label ?? "");
    setUrlId(initialData.url_id ?? "");
    setSelectedContentSources(selectedContentSourcesOptions);
    setSelectedProducts(selectedProductsOptions);
    setLinkRows(
      (initialData.links ?? []).map((link) => ({ ...link, mutation: "none" })),
    );
    setIsVisible(initialData.is_visible ?? true);
    setSortWeight(initialData.sort_weight ?? 0);
  }, [id, topic, selectedContentSourcesOptions, selectedProductsOptions]);

  if (!topic || !sources || !products) return <div>Loading...</div>;

  const sourceOptions = sources.map((s) => ({
    value: s.id,
    label: s.citation,
  }));
  const productOptions = products.map((p) => ({ value: p.id, label: p.title }));
  const handleAddLink = () => {
    setLinkRows((current) => [
      ...current,
      { link: "", type: "other", mutation: "create" },
    ]);
  };

  const updateLinkRow = (index: number, changes: Partial<LinkRow>) => {
    setLinkRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              ...changes,
              mutation: row.id === undefined ? "create" : "update",
            }
          : row,
      ),
    );
  };

  const handleSaveClick = () => {
    const current: TopicPropertyForm = {
      url_id: urlId,
      label: label,
      sort_weight: sortWeight,
      content_ids: selectedContentSources.map((source) => Number(source.value)),
      product_ids: selectedProducts.map((product) => String(product.value)),
      links: linkRows,

      is_visible: isVisible,
    };

    const changedPayload = diff(initialData, current);

    if (Object.keys(changedPayload).length === 0) {
      alert("No changes detected.");
      return;
    }

    topicUpdateMutation.mutate(
      { topicId: id, topic: changedPayload },
      {
        onSuccess: () => showToast(`Topic saved successfully (ID: ${id}).`),
        onError: (error) =>
          showError(error, `Failed to save topic (ID: ${id})`),
      },
    );
  };
  return (
    <form className="flex flex-col gap-6">
      <div
        className="
        grid 
        grid-cols-1 
        md:grid-cols-2 
        gap-6
      "
      >
        <div className="flex flex-col gap-1">
          <label className="font-medium">Topic Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="border border-dvrpc-gray-5 p-2 rounded"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium">URL ID</label>
          <input
            type="text"
            value={urlId}
            onChange={(e) => setUrlId(e.target.value)}
            className="border border-dvrpc-gray-5 p-2 rounded"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium">Sort Weight</label>
          <input
            type="number"
            value={sortWeight}
            onChange={(e) => setSortWeight(parseInt(e.target.value))}
            className="border border-dvrpc-gray-5 p-2 rounded"
          />
        </div>

        <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
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

        <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
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

        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
          <label className="font-medium">Links</label>
          {linkRows.map((row, index) =>
            row.mutation === "delete" ? null : (
              <div
                className="flex flex-wrap gap-2"
                key={row.id ?? `new-${index}`}
              >
                <input
                  type="url"
                  value={row.link}
                  onChange={(event) =>
                    updateLinkRow(index, { link: event.target.value })
                  }
                  className="border border-dvrpc-gray-5 p-2 rounded flex-1"
                  placeholder="https://..."
                />
                <select
                  value={row.type}
                  onChange={(event) =>
                    updateLinkRow(index, {
                      type: event.target.value as Link["type"],
                    })
                  }
                  className="border border-dvrpc-gray-5 p-2 rounded"
                >
                  <option value="census">Census</option>
                  <option value="catalog">Catalog</option>
                  <option value="other">Other</option>
                </select>
                <Button
                  type="secondary"
                  handleClick={() =>
                    setLinkRows((current) =>
                      current.flatMap((currentRow, rowIndex) => {
                        if (rowIndex !== index) return [currentRow];
                        return currentRow.id === undefined
                          ? []
                          : [{ ...currentRow, mutation: "delete" }];
                      }),
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            ),
          )}
          <Button type="secondary" handleClick={handleAddLink}>
            Add Link
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <Button
          type="primary"
          disabled={topicUpdateMutation.isPending}
          handleClick={handleSaveClick}
        >
          {topicUpdateMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
