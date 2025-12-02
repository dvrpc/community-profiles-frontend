import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiDeleteAuthorized,
  apiGet,
  apiPost,
  apiPostAuthorized,
  apiPutAuthorized,
} from "@/lib/api";
import {
  CategoryKeyMap,
  Content,
  GeoLevel,
  ProductResponse,
  ProfileData,
  PropertyForm,
  Source,
  SourceBase,
  Visualization,
  Viz,
} from "@/types/types";
import { PRODUCT_BASE_URL } from "@/consts";

export function useTree(geoLevel: GeoLevel) {
  return useQuery({
    queryKey: ["tree", geoLevel],
    queryFn: () => apiGet<CategoryKeyMap>(`/content/tree/${geoLevel}`),
  });
}

export function useProfile(geoLevel: GeoLevel, geoid?: string) {
  return useQuery({
    queryKey: ["profile", geoLevel, geoid],
    queryFn: () =>
      apiGet<ProfileData>(`/profile/${geoLevel}${geoid ? `/${geoid}` : ""}`),
    enabled: !!geoid,
  });
}

export function useContent(id: number) {
  return useQuery({
    queryKey: ["content", id],
    queryFn: () => apiGet<Content>(`/content/${id}`),
    enabled: id != 0,
  });
}

export function useViz(id: number) {
  return useQuery({
    queryKey: ["viz", id],
    queryFn: () => apiGet<Viz>(`/viz/${id}`),
    enabled: id != 0,
  });
}

export function useHistory(mode: string, id: number) {
  return useQuery({
    queryKey: ["history", mode, id],
    queryFn: () => apiGet<Content[]>(`/${mode}/${id}/history`),
    enabled: id != 0 && (mode == "content" || mode == "viz"),
  });
}

export function useSource() {
  return useQuery({
    queryKey: ["source"],
    queryFn: () => apiGet<Source[]>(`/source`),
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const productResponse = await apiGet<ProductResponse>(
        "/product?tags=Data Center&limit=999",
        PRODUCT_BASE_URL
      );
      return productResponse.items;
    },
  });
}

export function useCreateSource() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (source: SourceBase) =>
      apiPostAuthorized<Source>("/source", source),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["source"] });
    },
  });
}

export function useCreateSubcategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      newSubcat,
    }: {
      categoryId: number;
      newSubcat: string;
    }) =>
      apiPostAuthorized<number>(
        `/tree/subcategory?category_id=${categoryId}&name=${newSubcat}`
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tree"] });
    },
  });
}

export function useCreateTopic() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      subcatId,
      newTopic,
    }: {
      subcatId: number;
      newTopic: string;
    }) =>
      apiPostAuthorized<number>(
        `/tree/topic?subcategory_id=${subcatId}&name=${newTopic}`
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tree"] });
    },
  });
}

export function useUpdateSubcategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      subcatId,
      newSubcat,
    }: {
      subcatId: number;
      newSubcat: string;
    }) =>
      apiPutAuthorized<number>(
        `/tree/subcategory?id=${subcatId}&name=${newSubcat}`
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tree"] });
    },
  });
}
export function useUpdateTopic() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      newTopic,
      newLabel,
    }: {
      topicId: number;
      newTopic?: string;
      newLabel?: string;
    }) => {
      const params = new URLSearchParams({ id: String(topicId) });

      if (newTopic) params.append("name", newTopic);
      if (newLabel) params.append("label", newLabel);

      return apiPutAuthorized(`/tree/topic?${params.toString()}`);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tree"] });
    },
  });
}

export function useUpdateSource() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, source }: { id: number; source: SourceBase }) =>
      apiPutAuthorized<Source>(`/source/${id}`, source),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["source"] });
    },
  });
}

export function usePropertiesForm() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, source }: { id: number; source: SourceBase }) =>
      apiPutAuthorized<Source>(`/source/${id}`, source),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["source"] });
    },
  });
}

export function useDeleteSource() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDeleteAuthorized<void>(`/source/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["source"] });
    },
  });
}

export function useDeleteTopic() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDeleteAuthorized<void>(`/tree/topic/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tree"] });
    },
  });
}

export function useDeleteSubcategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiDeleteAuthorized<void>(`/tree/subcategory/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tree"] });
    },
  });
}

export function usePreview(
  template: string,
  mode: string,
  geoLevel: GeoLevel,
  geoid: string
) {
  return useQuery({
    queryKey: ["preview", mode, geoLevel, template, geoid],
    queryFn: () =>
      apiPost<string | Visualization[]>(
        `/${mode}/preview/${geoLevel}${geoLevel !== "region" ? `?geoid=${geoid}` : ""
        }`,
        mode === "viz" ? JSON.stringify(template) : template
      ),
    enabled: template !== "" && template !== "[]",
    staleTime: 0,
  });
}

export function useUpdateProperties() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<PropertyForm> }) =>
      apiPutAuthorized(`/content/${id}/properties`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
      qc.invalidateQueries({ queryKey: ["viz"] });
    },
  });
}

export function useSave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ url, body }: { url: string; body: string }) =>
      apiPutAuthorized(url, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["history"] });
      qc.invalidateQueries({ queryKey: ["preview"] });
    },
  });
}
