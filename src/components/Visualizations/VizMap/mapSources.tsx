import { Feature, SourceMap } from "@/types/types";

export default function getSources(features: Feature[]) {
    const sources: SourceMap = {
        countyboundaries: {
            type: "vector",
            url: "https://tiles.dvrpc.org/data/boundaries/countyboundaries",
        },
        municipalboundaries: {
            type: "vector",
            url: "https://tiles.dvrpc.org/data/boundaries/municipalboundaries",
        },
    };

    features.forEach(f => {
        sources[f.sourceLayer] = {
            type: "vector",
            url: f.sourceUrl,
        }
    })

    return sources
}


