import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import {
  updatePendiente,
  deletePendiente,
  togglePendiente,
  type UpdateInput,
} from "@/lib/db/pendientes";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = (await req.json()) as UpdateInput & { toggle?: boolean };
  const db = getDb();
  if (body.toggle) togglePendiente(db, Number(id));
  else updatePendiente(db, Number(id), body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  deletePendiente(getDb(), Number(id));
  return NextResponse.json({ ok: true });
}
