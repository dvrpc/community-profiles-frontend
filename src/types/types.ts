import {
  SourceSpecification,
  LayerSpecification,
  FilterSpecification,
  DataDrivenPropertyValueSpecification,
  ColorSpecification,
} from "mapbox-gl";
import { MapMouseEvent, GeoJSONFeature } from "mapbox-gl";
import { TopLevelSpec } from "vega-lite";

type ObjectType = Record<PropertyKey, unknown>;
type PickByValue<OBJ_T, VALUE_T> = // From https://stackoverflow.com/a/55153000
  Pick<
    OBJ_T,
    { [K in keyof OBJ_T]: OBJ_T[K] extends VALUE_T ? K : never }[keyof OBJ_T]
  >;
type ObjectEntries<OBJ_T> = // From https://stackoverflow.com/a/60142095
  {
    [K in keyof OBJ_T]: [keyof PickByValue<OBJ_T, OBJ_T[K]>, OBJ_T[K]];
  }[keyof OBJ_T][];

export function getTypedObjectEntries<OBJ_T extends ObjectType>(
  obj: OBJ_T,
): ObjectEntries<OBJ_T> {
  return Object.entries(obj) as ObjectEntries<OBJ_T>;
}

// eslint-disable-next-line
export type AllOrNothing<T extends Record<string, any>> =
  | T
  | Partial<Record<keyof T, never>>;

export type CategoryKeys =
  | "active-transportation"
  | "demographics-housing"
  | "economy"
  | "environment"
  | "freight"
  | "roadways"
  | "safety-health"
  | "transit";

export type MouseEvent = MapMouseEvent & {
  features?: GeoJSONFeature[];
};
export type GeoJSONProperties = Record<string, string | number | boolean>;

export interface LayerMap {
  [key: string]: LayerSpecification;
}

export interface SourceMap {
  [key: string]: SourceSpecification;
}

export type BuildStatus = {
  is_building: boolean;
  category: string | null;
  started_at: string | null;
  finished_at: string | null;
};

export interface Content {
  id: number;
  topic_id: number;
  label: string;
  sort_weight: number;
  category_id: number;
  geo_level: string;
  file: string;
  create_date: Date;
  is_visible: boolean;
  last_edited_by?: string;
  source_ids: number[];
  product_ids: string[];
  catalog_link: string;
  census_link: string;
  other_link: string;
}

export interface Viz {
  id: number;
  topic_id: number;
  geo_level: string;
  file: string;
  create_date: Date;
  source_ids: number[];
}

export interface SelectOption {
  value: number | string;
  label: string;
}

export interface TopicPropertyForm {
  label: string;
  sort_weight: number;
  content_sources: number[];
  viz_sources: number[];
  related_products: string[];
  catalog_link: string;
  census_link: string;
  other_link: string;
  is_visible: boolean;
}

export interface SubcategoryPropertyForm {
  label: string;
  sort_weight: number;
}

export type ProfileContent = Record<CategoryKeys, CategoryContent>;

export type CategoryContent = {
  content_id: number;
  category_id: number;
  content: string;
  subcategories: SubcategoryContent[];
};

export type SubcategoryContent = {
  id: number;
  name: string;
  label: string;
  topics: TopicContent[];
};

export type CategoryKeyMap = Record<CategoryKeys, CategoryTree>;

export type CategoryTree = {
  id: number;
  label: string;
  content_id: number;
  subcategories: SubcategoryTree[];
};

export type TreeTopic = {
  name: string;
  id: number;
  label: string;
  is_visible: boolean;
  content_id: number;
};
export type SubcategoryTree = {
  name: string;
  id: number;
  label: string;
  sort_weight: number;
  topics: TreeTopic[];
};

export type Topic = TopicBase & {
  id: number;
};

export type TopicBase = {
  name: string;
  label: string;
  sort_weight: number;
};

export type TopicRequest = {
  name?: string;
  label?: string;
  sort_weight?: number;
};

export type SubcategoryRequest = {
  name?: string;
  label?: string;
  sort_weight?: number;
};

export interface TopicContent {
  id: number;
  name: string;
  label: string;
  content: string;
  citations: string[];
  related_products: string[];
  census_link: string;
  catalog_link: string;
  other_link: string;
  variables: string[];
}

export type Visualization = (MapVisualization | ChartVisualization) & {
  subcategory: string;
  topic?: string;
};

export type Geometry = "Point" | "Line" | "Polygon";

export interface MapVisualization {
  type: "map";
  features: Feature[];
  legendOverride?: LegendOverrideItem[];
  alt?: string;
}

export interface ChartVisualization {
  type: "chart";
  schema: TopLevelSpec;
  variables: string[];
}

export interface SourceBase {
  agency: string;
  dataset: string;
  year_from?: number;
  year_to: number;
  citation: string;
}

export type Source = SourceBase & {
  id: number;
};

export type SourceForm = SourceBase & {
  id?: number;
};

export interface SqlBase {
  name: string;
  data_source: "gis" | "ckan" | "";
  geo_level: "region" | "county" | "municipality" | "";
  body: string;
}

export type Sql = SqlBase & {
  id: number;
};

export type SqlForm = SqlBase & { id?: number };

export interface VariableBase {
  name: string;
  data_source: "acs" | "ckan" | "gis";
  aggregateable?: boolean;
  acs_variable?: string;
  data_year?: number;
  description?: string;
  concept?: string;
  geo_levels?: GeoLevel[];
  last_updated?: string;
}

export type Variable = VariableBase & {
  id: number;
};

export type VariableForm = VariableBase & {
  id?: number;
};

export interface ACSVariableMetadata {
  name: string;
  label: string;
  concept: string;
  predicateType: string;
  group: string;
  limit: number;
  attributes: string;
}

export interface Link {
  id: number;
  link: string;
  type: "catalog" | "census" | "other";
}

export type ProductResponse = {
  items: Product[];
  hasMore: boolean;
  limit: number;
  offset: number;
  count: number;
};

export type Product = {
  id: string;
  title: string;
  urllink: string;
};

export interface Feature {
  sourceUrl: string;
  sourceLayer: string;
  geometry: Geometry;
  label: string;
  color?: string;
  filter?: FilterSpecification;
  colorExpression?: DataDrivenPropertyValueSpecification<ColorSpecification>;
}

export interface LegendOverrideItem {
  label: string;
  geometry: Geometry;
  color: string;
}

type Metric = {
  value: number | null;
  moe: number | null;
};

type Geography = {
  geoid: string;
  name: string;
  county_id: string | null;
  state: string;
  buffer_bbox: string;
};

type Profile<
  Parent = null,
  Metrics extends Record<string, Metric> = Record<string, Metric>,
> = Metrics & {
  parent?: Parent;
  geography: Geography;
};

export type RegionProfile = Profile<null>;

export type CountyProfile = Profile<RegionProfile>;

export type MunicipalityProfile = Profile<CountyProfile>;

export type ProfileMap = {
  region: RegionProfile;
  county: CountyProfile;
  municipality: MunicipalityProfile;
};

export type ProfileBundle = {
  [K in GeoLevel]: { geoLevel: K; profileData: ProfileMap[K] };
}[GeoLevel];

export type GeoLevel = keyof ProfileMap;

export interface MunicipalityInfo {
  geoid: string;
  label: string;
}
export type MunicipalityInfoMap = Record<
  CountySlug,
  Record<MunicipalitySlug, MunicipalityInfo>
>;

export type CountySlug =
  | "bucks"
  | "burlington"
  | "camden"
  | "chester"
  | "delaware"
  | "gloucester"
  | "montgomery"
  | "mercer"
  | "philadelphia";

export type MunicipalitySlug =
  | "spring-city-borough"
  | "ivyland-borough"
  | "east-greenwich-township"
  | "yeadon-borough"
  | "horsham-township"
  | "west-bradford-township"
  | "west-grove-borough"
  | "lower-salford-township"
  | "east-bradford-township"
  | "pine-hill-borough"
  | "darby-borough"
  | "east-caln-township"
  | "evesham-township"
  | "bristol-township"
  | "lower-pottsgrove-township"
  | "newfield-borough"
  | "hopewell-township"
  | "folcroft-borough"
  | "burlington-city"
  | "riverside-township"
  | "west-marlborough-township"
  | "gloucester-township"
  | "springfield-township"
  | "east-brandywine-township"
  | "ridley-park-borough"
  | "moorestown-township"
  | "berlin-township"
  | "upper-providence-township"
  | "lindenwold-borough"
  | "palmyra-borough"
  | "harrison-township"
  | "langhorne-borough"
  | "bensalem-township"
  | "london-britain-township"
  | "salford-township"
  | "upper-pottsgrove-township"
  | "lower-moreland-township"
  | "north-wales-borough"
  | "mount-laurel-township"
  | "ewing-township"
  | "darby-township"
  | "mantua-township"
  | "birmingham-township"
  | "upper-gwynedd-township"
  | "media-borough"
  | "perkasie-borough"
  | "glenolden-borough"
  | "perkiomen-township"
  | "eddystone-borough"
  | "lumberton-township"
  | "new-hope-borough"
  | "gloucester-city"
  | "north-coventry-township"
  | "west-pottsgrove-township"
  | "narberth-borough"
  | "uwchlan-township"
  | "honey-brook-township"
  | "dublin-borough"
  | "south-harrison-township"
  | "marple-township"
  | "nockamixon-township"
  | "robbinsville-township"
  | "clifton-heights-borough"
  | "gibbsboro-borough"
  | "pennsburg-borough"
  | "durham-township"
  | "tavistock-borough"
  | "kennett-square-borough"
  | "delran-township"
  | "west-caln-township"
  | "richlandtown-borough"
  | "milford-township"
  | "west-chester-borough"
  | "east-nottingham-township"
  | "haddon-township"
  | "silverdale-borough"
  | "hopewell-borough"
  | "willingboro-township"
  | "glassboro-borough"
  | "east-windsor-township"
  | "wenonah-borough"
  | "woodland-township"
  | "marlborough-township"
  | "edgewater-park-township"
  | "lower-frederick-township"
  | "washington-township"
  | "tabernacle-township"
  | "upland-borough"
  | "easttown-township"
  | "runnemede-borough"
  | "chester-township"
  | "newtown-township"
  | "thornbury-township"
  | "royersford-borough"
  | "tullytown-borough"
  | "east-marlborough-township"
  | "west-fallowfield-township"
  | "london-grove-township"
  | "collingswood-borough"
  | "solebury-township"
  | "telford-borough"
  | "pemberton-borough"
  | "chalfont-borough"
  | "middletown-township"
  | "mount-holly-township"
  | "concord-township"
  | "new-london-township"
  | "trappe-borough"
  | "brooklawn-borough"
  | "westville-borough"
  | "audubon-borough"
  | "ambler-borough"
  | "upper-dublin-township"
  | "downingtown-borough"
  | "lower-gwynedd-township"
  | "doylestown-borough"
  | "sharon-hill-borough"
  | "lower-makefield-township"
  | "haverford-township"
  | "upper-uwchlan-township"
  | "medford-township"
  | "montgomery-township"
  | "coatesville-city"
  | "bellmawr-borough"
  | "trumbauersville-borough"
  | "wrightstown-township"
  | "jenkintown-borough"
  | "pottstown-borough"
  | "stratford-borough"
  | "east-norriton-township"
  | "west-goshen-township"
  | "upper-oxford-township"
  | "plymouth-township"
  | "collegeville-borough"
  | "haddonfield-borough"
  | "west-brandywine-township"
  | "winslow-township"
  | "towamencin-township"
  | "swarthmore-borough"
  | "tinicum-township"
  | "west-nantmeal-township"
  | "rutledge-borough"
  | "upper-southampton-township"
  | "green-lane-borough"
  | "malvern-borough"
  | "bordentown-city"
  | "warwick-township"
  | "princeton"
  | "philadelphia-city"
  | "bordentown-township"
  | "upper-providence-township"
  | "new-hanover-township"
  | "newlin-township"
  | "worcester-township"
  | "bethel-township"
  | "woodbury-heights-borough"
  | "lower-southampton-township"
  | "schwenksville-borough"
  | "rose-valley-borough"
  | "east-rockhill-township"
  | "pitman-borough"
  | "nether-providence-township"
  | "sellersville-borough"
  | "hi-nella-borough"
  | "thornbury-township"
  | "west-norriton-township"
  | "west-conshohocken-borough"
  | "chester-heights-borough"
  | "riverton-borough"
  | "chesterfield-township"
  | "conshohocken-borough"
  | "upper-makefield-township"
  | "hatboro-borough"
  | "parkesburg-borough"
  | "hatfield-township"
  | "sadsbury-township"
  | "west-windsor-township"
  | "highland-township"
  | "prospect-park-borough"
  | "shamong-township"
  | "paulsboro-borough"
  | "souderton-borough"
  | "telford-borough"
  | "lansdowne-borough"
  | "hilltown-township"
  | "fieldsboro-borough"
  | "trainer-borough"
  | "plumstead-township"
  | "florence-township"
  | "modena-borough"
  | "new-garden-township"
  | "hainesport-township"
  | "hightstown-borough"
  | "collingdale-borough"
  | "franconia-township"
  | "aston-township"
  | "bristol-borough"
  | "haycock-township"
  | "swedesboro-borough"
  | "audubon-park-borough"
  | "new-britain-township"
  | "penndel-borough"
  | "rockledge-borough"
  | "bedminster-township"
  | "hatfield-borough"
  | "springfield-township"
  | "hamilton-township"
  | "west-sadsbury-township"
  | "buckingham-township"
  | "west-deptford-township"
  | "ridley-township"
  | "lower-merion-township"
  | "mount-ephraim-borough"
  | "penn-township"
  | "east-whiteland-township"
  | "springfield-township"
  | "cheltenham-township"
  | "morrisville-borough"
  | "upper-salford-township"
  | "cinnaminson-township"
  | "riegelsville-borough"
  | "west-nottingham-township"
  | "monroe-township"
  | "northampton-township"
  | "east-greenville-borough"
  | "logan-township"
  | "clayton-borough"
  | "chester-city"
  | "lawnside-borough"
  | "laurel-springs-borough"
  | "norristown-borough"
  | "somerdale-borough"
  | "limerick-township"
  | "deptford-township"
  | "avondale-borough"
  | "east-goshen-township"
  | "phoenixville-borough"
  | "atglen-borough"
  | "upper-darby-township"
  | "berlin-borough"
  | "warwick-township"
  | "honey-brook-borough"
  | "merchantville-borough"
  | "medford-lakes-borough"
  | "langhorne-manor-borough"
  | "greenwich-township"
  | "east-coventry-township"
  | "south-coventry-township"
  | "elk-township"
  | "upper-moreland-township"
  | "westtown-township"
  | "lower-oxford-township"
  | "newtown-borough"
  | "franklin-township"
  | "wrightstown-borough"
  | "lansdale-borough"
  | "newtown-township"
  | "yardley-borough"
  | "woodbury-city"
  | "new-britain-borough"
  | "schuylkill-township"
  | "trenton-city"
  | "caln-township"
  | "west-whiteland-township"
  | "west-pikeland-township"
  | "oxford-borough"
  | "douglass-township"
  | "pennsbury-township"
  | "norwood-borough"
  | "upper-chichester-township"
  | "bridgeton-township"
  | "mansfield-township"
  | "aldan-borough"
  | "camden-city"
  | "pemberton-township"
  | "lawrence-township"
  | "elverson-borough"
  | "upper-frederick-township"
  | "clementon-borough"
  | "middletown-township"
  | "abington-township"
  | "pennington-borough"
  | "west-vincent-township"
  | "haddon-heights-borough"
  | "eastampton-township"
  | "springfield-township"
  | "pennsauken-township"
  | "west-rockhill-township"
  | "morton-borough"
  | "south-coatesville-borough"
  | "east-vincent-township"
  | "hulmeville-borough"
  | "barrington-borough"
  | "red-hill-borough"
  | "washington-township"
  | "warminster-township"
  | "tinicum-township"
  | "woodlynne-borough"
  | "lower-chichester-township"
  | "franklin-township"
  | "chesilhurst-borough"
  | "southampton-township"
  | "beverly-city"
  | "maple-shade-township"
  | "cherry-hill-township"
  | "tredyffrin-township"
  | "upper-merion-township"
  | "new-hanover-township"
  | "kennett-township"
  | "richland-township"
  | "east-fallowfield-township"
  | "chadds-ford-township"
  | "magnolia-borough"
  | "waterford-township"
  | "pocopson-township"
  | "bryn-athyn-borough"
  | "doylestown-township"
  | "valley-township"
  | "warrington-township"
  | "whitpain-township"
  | "parkside-borough"
  | "radnor-township"
  | "east-nantmeal-township"
  | "east-lansdowne-borough"
  | "edgmont-township"
  | "londonderry-township"
  | "falls-township"
  | "lower-providence-township"
  | "quakertown-borough"
  | "bridgeport-borough"
  | "marcus-hook-borough"
  | "burlington-township"
  | "brookhaven-borough"
  | "wallace-township"
  | "east-pikeland-township"
  | "millbourne-borough"
  | "charlestown-township"
  | "westampton-township"
  | "delanco-township"
  | "skippack-township"
  | "willistown-township"
  | "oaklyn-borough"
  | "upper-hanover-township"
  | "whitemarsh-township"
  | "elk-township"
  | "voorhees-township"
  | "bass-river-township"
  | "national-park-borough"
  | "woolwich-township"
  | "colwyn-borough"
  | "north-hanover-township";
