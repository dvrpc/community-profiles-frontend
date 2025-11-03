import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import {
  CategoryKeyMap,
  Content,
  GeoLevel,
  ProfileData,
  Visualization,
} from "@/types";

export function useTree(geoLevel: GeoLevel) {
  return useQuery({
    queryKey: ["tree", geoLevel],
    queryFn: () => apiGet<CategoryKeyMap>(`/content/template/tree/${geoLevel}`),
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

export function useTemplate(
  category: string,
  subcategory: string,
  topic: string,
  mode: string,
  geoLevel: GeoLevel
) {
  return useQuery({
    queryKey: ["template", mode, geoLevel, category, subcategory, topic],
    queryFn: () =>
      apiGet<string>(
        `/${mode}/template/${geoLevel}?category=${category}&subcategory=${subcategory}&topic=${topic}`
      ),
    enabled: !!topic,
  });
}

export function useHistory(
  category: string,
  subcategory: string,
  topic: string,
  mode: string,
  geoLevel: GeoLevel
) {
  return useQuery({
    queryKey: ["history", mode, geoLevel, category, subcategory, topic],
    queryFn: () =>
      apiGet<Content[]>(
        `/${mode}/history/${geoLevel}?category=${category}&subcategory=${subcategory}&topic=${topic}`
      ),
    enabled: !!topic,
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
      apiPost(
        `/${mode}/preview/${geoLevel}${
          geoLevel !== "region" ? `?geoid=${geoid}` : ""
        }`,
        mode === "viz" ? JSON.stringify(template) : template
      ),
    // enabled: !!topic,
    staleTime: 0,
  });
}

export function useSave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ url, body }: { url: string; body: string }) =>
      apiPut(url, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["history"] });
      qc.invalidateQueries({ queryKey: ["preview"] });
    },
  });
}
