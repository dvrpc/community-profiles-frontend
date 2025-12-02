import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const secret = process.env.REVALIDATE_SECRET;
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { geoLevel } = body;

    await revalidateTag(geoLevel)

    return NextResponse.json({ revalidated: true, geoLevel }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
