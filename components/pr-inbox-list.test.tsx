import { describe, expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ShortcutProvider } from "./shortcut-provider";
import { PrInboxList } from "./pr-inbox-list";
import type { InboxItem } from "@/lib/github/inbox";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/hooks/use-settings", () => ({
  useSettings: () => null,
}));

const items: InboxItem[] = [
  {
    id: 1,
    number: 42,
    title: "Fix A",
    url: "",
    repo: "acme/web",
    state: "open",
    draft: false,
    author: "alice",
    labels: [],
    updated_at: "",
    reason: "review-requested",
  },
  {
    id: 2,
    number: 43,
    title: "Fix B",
    url: "",
    repo: "acme/web",
    state: "open",
    draft: false,
    author: "bob",
    labels: [],
    updated_at: "",
    reason: "assigned",
  },
];

function Wrap(props: { items: InboxItem[] }) {
  return (
    <ShortcutProvider>
      <PrInboxList items={props.items} />
    </ShortcutProvider>
  );
}

describe("PrInboxList", () => {
  test("j / k moves focus", () => {
    render(<Wrap items={items} />);
    fireEvent.keyDown(window, { key: "j" });
    expect(screen.getByText("Fix B").closest("a")).toHaveClass("shadow-lift");
    fireEvent.keyDown(window, { key: "k" });
    expect(screen.getByText("Fix A").closest("a")).toHaveClass("shadow-lift");
  });

  test("empty state when list is empty", () => {
    render(<Wrap items={[]} />);
    expect(screen.getByText(/inbox is clear/i)).toBeInTheDocument();
  });
});
