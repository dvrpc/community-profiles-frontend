import { County } from "@/interfaces/county";

export type Municipality extends County = {
  municipality: string;
}
