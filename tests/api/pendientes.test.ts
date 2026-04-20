import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("/api/pendientes", () => {
  beforeEach(() => {
    const tmp = mkdtempSync(join(tmpdir(), "api-"));
    process.env.DB_PATH = join(tmp, "api.db");
    vi.resetModules();
  });
  afterEach(() => vi.resetModules());

  test("POST creates, GET lists", async () => {
    const { POST, GET } = await import("@/app/api/pendientes/route");
    const postRes = await POST(
      new Request("http://t/api/pendientes", {
        method: "POST",
        body: JSON.stringify({ title: "hello" }),
        headers: { "content-type": "application/json" },
      }),
    );
    expect(postRes.status).toBe(201);
    const getRes = await GET();
    const data = await getRes.json();
    expect(data.items).toHaveLength(1);
    expect(data.items[0].title).toBe("hello");
  });
});
