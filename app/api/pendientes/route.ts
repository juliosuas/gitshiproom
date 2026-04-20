import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import {
  createPendiente,
  listPendientes,
  type CreateInput,
} from "@/lib/db/pendientes";

export const runtime = "nodejs";

export async function GET() {
  const items = listPendientes(getDb());
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const body = (await req.json()) as CreateInput;
  if (!body.title || typeof body.title !== "string") {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }
  const id = createPendiente(getDb(), body);
  return NextResponse.json({ id }, { status: 201 });
}
