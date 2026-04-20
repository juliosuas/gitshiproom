"use client";
import * as React from "react";

type Scope = "global" | "inbox" | "pr-detail" | "issues";

type Entry = { key: string; handler: (e: KeyboardEvent) => void; scope: Scope };
const Ctx = React.createContext<{
  register: (e: Entry) => () => void;
  activeScope: Scope;
  setScope: (s: Scope) => void;
} | null>(null);

export function ShortcutProvider({ children }: { children: React.ReactNode }) {
  const entriesRef = React.useRef<Entry[]>([]);
  const [activeScope, setScope] = React.useState<Scope>("global");

  React.useEffect(() => {
    function isEditable(el: EventTarget | null): boolean {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    }

    function onKey(e: KeyboardEvent) {
      if (isEditable(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      for (const entry of entriesRef.current) {
        if (
          entry.key === e.key &&
          (entry.scope === "global" || entry.scope === activeScope)
        ) {
          entry.handler(e);
          break;
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeScope]);

  const register = React.useCallback((entry: Entry) => {
    entriesRef.current.push(entry);
    return () => {
      entriesRef.current = entriesRef.current.filter((e) => e !== entry);
    };
  }, []);

  return (
    <Ctx.Provider value={{ register, activeScope, setScope }}>
      {children}
    </Ctx.Provider>
  );
}

export function useShortcut(
  key: string,
  handler: (e: KeyboardEvent) => void,
  scope: Scope = "global",
) {
  const ctx = React.useContext(Ctx);
  const handlerRef = React.useRef(handler);
  handlerRef.current = handler;
  React.useEffect(() => {
    if (!ctx) return;
    return ctx.register({
      key,
      scope,
      handler: (e) => handlerRef.current(e),
    });
  }, [key, scope, ctx]);
}

export function useScope(scope: Scope) {
  const ctx = React.useContext(Ctx);
  React.useEffect(() => {
    if (!ctx) return;
    ctx.setScope(scope);
    return () => ctx.setScope("global");
  }, [scope, ctx]);
}
