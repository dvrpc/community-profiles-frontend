import { SourceSpecification, LayerSpecification } from "mapbox-gl";

export interface LayerMap {
  [key: string]: LayerSpecification;
}

export interface SourceMap {
  [key: string]: SourceSpecification;
}
