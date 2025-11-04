import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAllCountyMunicipalityPairs } from "@/utils";

export async function POST(req: Request) {
    try {
        const secret = process.env.REVALIDATE_SECRET;
        const authHeader = req.headers.get("authorization");

        if (authHeader !== `Bearer ${secret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { geoLevel } = body;

        let paths: string[] = [];

        console.log(geoLevel + ' revalidation request received')

        switch (geoLevel) {
            case "region":
                paths = ["/"];
                break;

            case "county":
                {
                    const allPairs = await getAllCountyMunicipalityPairs();
                    const countySet = new Set(allPairs.map((p) => p.county));
                    paths = Array.from(countySet).map((c) => `/${c}`);
                }
                break;

            case "municipality":
                {
                    const allPairs = await getAllCountyMunicipalityPairs();
                    paths = allPairs.map(
                        (p) => `/${p.county}/${p.municipality}`
                    );
                }
                break;

            default:
                return NextResponse.json({ error: "Invalid geoLevel" }, { status: 400 });
        }

        // Revalidate all paths in parallel
        await Promise.allSettled(paths.map((path) => revalidatePath(path)));

        return NextResponse.json({ revalidated: true, paths }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
    }
}
