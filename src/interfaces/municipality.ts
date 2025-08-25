import { County } from "@/interfaces/county";

export type Municipality = County & {
  municipality: string;
}
