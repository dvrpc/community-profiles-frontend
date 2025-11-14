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
  ProfileData,
  Source,
  SourceBase,
  Visualization,
  Viz,
} from "@/types/types";

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
    enabled: id != 0,
  });
}

export function useSource() {
  return useQuery({
    queryKey: ["source"],
    queryFn: () => apiGet<Source[]>(`/source`),
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

export function useDeleteSource() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDeleteAuthorized<void>(`/source/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["source"] });
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
