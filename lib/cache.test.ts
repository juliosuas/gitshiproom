import { describe, expect, test, vi } from "vitest";
import { TtlCache } from "./cache";

describe("TtlCache", () => {
  test("returns undefined when empty", () => {
    const c = new TtlCache<string>(1000);
    expect(c.get("k")).toBeUndefined();
  });

  test("returns value before expiry", () => {
    const c = new TtlCache<string>(1000);
    c.set("k", "v");
    expect(c.get("k")).toBe("v");
  });

  test("expires after ttl", () => {
    vi.useFakeTimers();
    const c = new TtlCache<string>(100);
    c.set("k", "v");
    vi.advanceTimersByTime(150);
    expect(c.get("k")).toBeUndefined();
    vi.useRealTimers();
  });

  test("getOrSet only runs loader on miss", async () => {
    const c = new TtlCache<number>(1000);
    const loader = vi.fn(async () => 42);
    expect(await c.getOrSet("x", loader)).toBe(42);
    expect(await c.getOrSet("x", loader)).toBe(42);
    expect(loader).toHaveBeenCalledTimes(1);
  });
});
