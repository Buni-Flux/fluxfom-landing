// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NeonPlayFrame } from "./NeonPlayFrame";

describe("NeonPlayFrame", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads and embeds a fetched project video", async () => {
    const fetchMock = vi.mocked(fetch as unknown as ReturnType<typeof vi.fn>);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "123",
          title: "Demo reel",
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
      ],
    } as Response);

    render(<NeonPlayFrame visible />);

    await waitFor(() => expect(screen.getByTitle("Demo reel")).toBeTruthy());

    const iframe = screen.getByTitle("Demo reel");
    expect(iframe.getAttribute("src")).toContain("youtube.com/embed/");
  });
});
