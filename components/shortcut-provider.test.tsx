import { describe, expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ShortcutProvider, useShortcut } from "./shortcut-provider";

function Demo({ onTrigger }: { onTrigger: () => void }) {
  useShortcut("a", onTrigger, "global");
  return <div>ready</div>;
}

describe("useShortcut", () => {
  test("invokes handler on key press", () => {
    const spy = vi.fn();
    render(
      <ShortcutProvider>
        <Demo onTrigger={spy} />
      </ShortcutProvider>,
    );
    fireEvent.keyDown(window, { key: "a" });
    expect(spy).toHaveBeenCalled();
  });

  test("ignores when typing in an input", () => {
    const spy = vi.fn();
    render(
      <ShortcutProvider>
        <input data-testid="in" />
        <Demo onTrigger={spy} />
      </ShortcutProvider>,
    );
    const input = screen.getByTestId("in");
    input.focus();
    fireEvent.keyDown(input, { key: "a" });
    expect(spy).not.toHaveBeenCalled();
  });
});
