import { NextResponse } from "next/server";
import { getInbox } from "@/lib/github/inbox";
import { MissingTokenError } from "@/lib/github/client";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const me = url.searchParams.get("me") ?? "me";
    const items = await getInbox(me);
    return NextResponse.json({ items });
  } catch (e) {
    if (e instanceof MissingTokenError) {
      return NextResponse.json({ error: "missing_token" }, { status: 428 });
    }
    throw e;
  }
}
