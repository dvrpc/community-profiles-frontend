import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import {
  apiDeleteAuthorized,
  apiGet,
  apiGetAuthorized,
  apiPostAuthorized,
  apiPutAuthorized,
} from "@/lib/api";
import {
  Content,
  GeoLevel,
  ProductResponse,
  TopicPropertyForm,
  SubcategoryPropertyForm,
  Source,
  SourceBase,
  VizFile,
  Viz,
  SubcategoryRequest,
  Variable,
  VariableBase,
  ACSVariableMetadata,
  AppMetadata,
  BuildStatus,
  SqlBase,
  Sql,
  ProfileMap,
  Category,
  SubcategoryUpdate,
  TopicCreate,
  SubcategoryCreate,
  ContentUpdate,
  Link,
  LinkCreate,
  VizCreate,
  VizUpdate,
} from "@/types/types";
import { PRODUCT_BASE_URL, PRODUCT_IMAGE_BASE_URL } from "@/consts";
import { TreeLevel } from "@/app/admin/Dashboard";

export function useTree(geoLevel: GeoLevel) {
  return useQuery({
    queryKey: ["tree", geoLevel],
    queryFn: () => apiGet<Category[]>(`/category/tree?geo_level=${geoLevel}`),
  });
}

export function useProfile<T extends GeoLevel>(geoLevel: T, geoid?: string) {
  return useQuery<ProfileMap[T]>({
    queryKey: ["profile", geoLevel, geoid],
    queryFn: () =>
      apiGet<ProfileMap[T]>(`/profile/${geoLevel}${geoid ? `/${geoid}` : ""}`),
    enabled: geoLevel === "region" || !!geoid,
  });
}

export function useContent(id: number, treeLevel: TreeLevel) {
  return useQuery({
    queryKey: ["content", id, treeLevel],
    queryFn: () => apiGet<Content>(`/content/${treeLevel}/${id}`),
    enabled: id != 0 && (treeLevel == "category" || treeLevel == "topic"),
  });
}

export function useCategoryContent(id: number) {
  return useQuery({
    queryKey: ["content", id],
    queryFn: () => apiGet<Content>(`/content/category/${id}`),
    enabled: id != 0,
  });
}

export function useTopic(id: number) {
  return useQuery({
    queryKey: ["topic", id],
    queryFn: () => apiGet<TopicPropertyForm>(`/topic/${id}`),
    enabled: id != 0,
  });
}

export function useSubcategory(id: number) {
  return useQuery({
    queryKey: ["subcategory", id],
    queryFn: () => apiGet<SubcategoryPropertyForm>(`/subcategory/${id}`),
    enabled: id != 0,
  });
}

export function useTopicContent(id: number) {
  return useQuery({
    queryKey: ["content", id],
    queryFn: () => apiGet<Content>(`/content/topic/${id}`),
    enabled: id != 0,
  });
}

export function useVisualizations(topic_id: number) {
  return useQuery({
    queryKey: ["viz", topic_id],
    queryFn: () => apiGet<Viz[]>(`/viz/${topic_id}`),
    enabled: topic_id != 0,
  });
}

export function useCreateVisualization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ viz }: { viz: VizCreate }) =>
      apiPostAuthorized<number>("/viz", viz),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["viz"] });
    },
  });
}

export function useUpdateVisualization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, viz }: { id: number; viz: VizUpdate }) =>
      apiPutAuthorized(`/viz/${id}`, viz),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["viz"] });
      qc.invalidateQueries({ queryKey: ["viz-history"] });
    },
  });
}

export function useDeleteVisualization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiDeleteAuthorized<void>(`/viz/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["viz"] });
    },
  });
}

export function useVizHistory(viz?: { id?: number }) {
  return useQuery({
    queryKey: ["viz-history", viz?.id],
    queryFn: () => {
      if (!viz?.id) throw new Error("Missing viz ID");
      return apiGet<Viz[]>(`/viz/${viz.id}/history`);
    },
    enabled: !!viz?.id && viz.id !== 0,
  });
}

export function useContentHistory(content?: Content) {
  return useQuery({
    queryKey: ["history", content?.id],
    queryFn: () => {
      if (!content?.id) throw new Error("Missing content ID");
      return apiGet<Content[]>(`/content/${content.id}/history`);
    },
    enabled: !!content?.id && content.id !== 0,
  });
}

export function useVariable() {
  return useQuery({
    queryKey: ["variable"],
    queryFn: () => apiGet<Variable[]>(`/variable`),
  });
}

export function useGeoVariable(geoLevel: GeoLevel) {
  return useQuery({
    queryKey: ["geo-variable", geoLevel],
    queryFn: () => apiGet<Variable[]>(`/variable/${geoLevel}`),
  });
}

export function useSql() {
  return useQuery({
    queryKey: ["sql"],
    queryFn: () => apiGet<Sql[]>(`/sql`),
  });
}

export function useSource() {
  return useQuery({
    queryKey: ["source"],
    queryFn: () => apiGet<Source[]>(`/source`),
  });
}

export function useLinks() {
  return useQuery({
    queryKey: ["link"],
    queryFn: () => apiGet<Link[]>("/link"),
  });
}

export function useCreateLink() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (link: LinkCreate) => apiPostAuthorized<Link>("/link", link),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["link"] });
    },
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const productResponse = await apiGet<ProductResponse>(
        "/product?limit=999",
        PRODUCT_BASE_URL,
      );
      return productResponse.items;
    },
  });
}

export function useProducts(productIds: string[]) {
  const queries = productIds.map((id) => ({
    queryKey: ["product", id],
    queryFn: async () => {
      const productResponse = await apiGet<ProductResponse>(
        `/product?id=${id}`,
        PRODUCT_BASE_URL,
      );
      return productResponse.items[0];
    },
  }));

  return useQueries({ queries });
}

export function useCreateVariable() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (variable: VariableBase) =>
      apiPostAuthorized<Variable>("/variable", variable),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["variable"] });
    },
  });
}

export function useCreateSql() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (sql: SqlBase) => apiPostAuthorized<Sql>("/sql", sql),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sql"] });
    },
  });
}

export function useTestSql(isDetailed: boolean = false) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (sql: SqlBase) =>
      apiPostAuthorized<Sql>(`/sql/test?detailed=${isDetailed}`, sql),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sql"] });
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
    mutationFn: (subcategory: SubcategoryCreate) =>
      apiPostAuthorized<number>(`/subcategory`, subcategory),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tree"] });
    },
  });
}

export function useCreateTopic() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (topic: TopicCreate) =>
      apiPostAuthorized<number>(`/topic`, topic),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tree"] });
    },
  });
}

export function useUpdateSubcategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      subcategoryId,
      subcategory,
    }: {
      subcategoryId: number;
      subcategory: SubcategoryRequest;
    }) =>
      apiPutAuthorized<number>(`/subcategory/${subcategoryId}`, subcategory),
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
      topic,
    }: {
      topicId: number;
      topic: Partial<TopicPropertyForm>;
    }) => apiPutAuthorized<number>(`/topic/${topicId}`, topic),

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

export function useUpdateVariable() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, variable }: { id: number; variable: VariableBase }) =>
      apiPutAuthorized<Variable>(`/variable/${id}`, variable),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["variable"] });
    },
  });
}

export function useUpdateSql() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, sql }: { id: number; sql: SqlBase }) =>
      apiPutAuthorized<Sql>(`/sql/${id}`, sql),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sql"] });
    },
  });
}

export function useDeleteVariable() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDeleteAuthorized<void>(`/variable/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["variable"] });
    },
  });
}

export function useDeleteSql() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDeleteAuthorized<void>(`/sql/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sql"] });
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
    mutationFn: (id: number) => apiDeleteAuthorized<void>(`/topic/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tree"] });
    },
  });
}

export function useDeleteSubcategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDeleteAuthorized<void>(`/subcategory/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tree"] });
    },
  });
}

export function useContentPreview(
  template: string,
  geoLevel: GeoLevel,
  geoid?: string,
) {
  return useQuery<string>({
    queryKey: ["preview", "content", template, geoLevel, geoid],
    queryFn: () =>
      apiPostAuthorized<string>(
        `/content/preview/${geoLevel}${geoLevel !== "region" ? `?geoid=${geoid}` : ""}`,
        template,
      ),
    enabled: template !== "",
    retry: false,
    staleTime: 0,
  });
}

export function useVizPreview(
  template: VizFile | null,
  geoLevel: GeoLevel,
  geoid?: string,
) {
  return useQuery<VizFile>({
    queryKey: ["preview", "viz", geoLevel, template, geoid],
    queryFn: () =>
      apiPostAuthorized<VizFile>(
        `/viz/preview/${geoLevel}${geoLevel !== "region" ? `?geoid=${geoid}` : ""}`,
        JSON.stringify(template),
      ),
    enabled: !!template,
    retry: false,
    staleTime: 0,
  });
}

export function useUpdateProperties() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<TopicPropertyForm> | { viz_sources: number[] };
    }) => apiPutAuthorized(`/content/${id}/properties`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
      qc.invalidateQueries({ queryKey: ["viz"] });
      qc.invalidateQueries({ queryKey: ["tree"] });
    },
  });
}

export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ContentUpdate }) =>
      apiPutAuthorized(`/content/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
      qc.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
export function useSave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      url,
      body,
    }: {
      url: string;
      body: { user: string; text: string };
    }) => apiPutAuthorized(url, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
      qc.invalidateQueries({ queryKey: ["viz"] });
      qc.invalidateQueries({ queryKey: ["history"] });
      qc.invalidateQueries({ queryKey: ["preview"] });
    },
  });
}

export function useACSMetadata(
  acsVariable: string,
  dataYear: number | undefined,
) {
  return useQuery({
    queryKey: ["acs-metadata", acsVariable, dataYear],
    queryFn: async () => {
      const data = await apiGet<ACSVariableMetadata>(
        `/acs/${dataYear}/${acsVariable}`,
      );
      return {
        concept: data.concept ?? "",
        description: data.label ?? "",
      };
    },
    enabled: !!acsVariable.trim() && !!dataYear,
    staleTime: Infinity,
    retry: false,
  });
}

export function useBuildStatus() {
  return useQuery({
    queryKey: ["build-status"],
    queryFn: () => apiGet<BuildStatus>(`/build/status`),
    refetchInterval: 3000,
  });
}

export function useAppMetadata() {
  return useQuery({
    queryKey: ["app-metadata"],
    queryFn: () => apiGetAuthorized<AppMetadata[]>("/app-metadata"),
    staleTime: Infinity,
  });
}

export function useTriggerBuild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ category }: { category: "acs" | "gis" | "ckan" | "all" }) =>
      apiPostAuthorized(`/build/${category}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["build-status"] });
      queryClient.invalidateQueries({ queryKey: ["app-metadata"] });
    },
  });
}
