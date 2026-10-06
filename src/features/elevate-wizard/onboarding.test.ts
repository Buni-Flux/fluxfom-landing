// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ElevateBrandWizard } from "./ElevateBrandWizard";
import { buildProjectPayload, getProjectOwner, projectProgressStages } from "./onboarding";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("buildProjectPayload", () => {
  it("requires at least an email or phone number", () => {
    expect(() =>
      buildProjectPayload({
        customerType: "creative",
        name: "Ava",
        email: "",
        phone: "",
        preferredContactMethod: "email",
        profession: "Photographer",
        primaryGoal: "Build a stronger digital presence",
        services: ["Brand positioning"],
        projectDescription: "Need a clearer online presence",
      }),
    ).toThrow(/email or phone/i);
  });

  it("creates a stable project title and summary for each customer type", () => {
    const payload = buildProjectPayload({
      customerType: "business",
      name: "Maya",
      companyName: "Northline Studio",
      email: "maya@northline.studio",
      phone: "",
      preferredContactMethod: "email",
      primaryGoal: "Clarify positioning and launch a marketing system",
      services: ["Brand positioning", "Social media"],
      projectDescription: "We need stronger positioning and content direction",
    });

    expect(payload.title).toContain("Northline Studio");
    expect(payload.customerType).toBe("business");
    expect(payload.summary).toContain("Brand positioning");
  });
});

describe("projectProgressStages", () => {
  it("supports the lightweight project lifecycle used by the client portal", () => {
    expect(projectProgressStages[0].key).toBe("request_received");
    expect(projectProgressStages.map((stage) => stage.key)).toContain("reviewing");
  });
});

describe("getProjectOwner", () => {
  it("reuses an existing authenticated session", async () => {
    const signInAnonymously = vi.fn();
    const owner = await getProjectOwner({
      getSession: async () => ({ data: { session: { access_token: "existing-jwt", user: { id: "existing-user" } } }, error: null }),
      signInAnonymously,
    });

    expect(owner).toEqual({ userId: "existing-user", accessToken: "existing-jwt" });
    expect(signInAnonymously).not.toHaveBeenCalled();
  });

  it("creates an authenticated anonymous session for a guest", async () => {
    const owner = await getProjectOwner({
      getSession: async () => ({ data: { session: null }, error: null }),
      signInAnonymously: async () => ({
        data: { user: { id: "guest-user" }, session: { access_token: "guest-jwt" } },
        error: null,
      }),
    });

    expect(owner).toEqual({ userId: "guest-user", accessToken: "guest-jwt" });
  });

  it("rejects an anonymous user result without an authenticated session", async () => {
    await expect(
      getProjectOwner({
        getSession: async () => ({ data: { session: null }, error: null }),
        signInAnonymously: async () => ({
          data: { user: { id: "guest-user" }, session: null },
          error: null,
        }),
      }),
    ).rejects.toThrow(/secure project session/i);
  });
});

describe("ElevateBrandWizard", () => {
  it("reveals the question, description, and answers in sequence", () => {
    vi.useFakeTimers();
    render(React.createElement(MemoryRouter, null, React.createElement(ElevateBrandWizard)));

    const title = "What best describes you?";
    const heading = screen.getByRole("heading", { name: title });
    const description = screen.getByText("Start with the option that fits best.");

    expect(screen.getByText(/steps left/i)).toBeTruthy();
    expect(heading.textContent).toBe("");
    expect(description.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("button", { name: /i’m here for myself/i })).toBeNull();

    act(() => vi.advanceTimersByTime(title.length * 36));
    expect(heading.textContent).toBe(title);
    expect(description.getAttribute("aria-hidden")).toBe("true");

    act(() => vi.advanceTimersByTime(1300));
    expect(description.getAttribute("aria-hidden")).toBe("false");
    expect(screen.queryByRole("button", { name: /i’m here for myself/i })).toBeNull();

    act(() => vi.advanceTimersByTime(350));
    expect(screen.getByRole("button", { name: /i’m here for myself/i })).toBeTruthy();
  });

  it("reveals the next prompt after choosing the customer type", () => {
    vi.useFakeTimers();
    render(React.createElement(MemoryRouter, null, React.createElement(ElevateBrandWizard)));

    const currentTitle = "What best describes you?";
    act(() => vi.advanceTimersByTime(currentTitle.length * 36 + 1650));
    fireEvent.click(screen.getByRole("button", { name: /i’m here for myself/i }));

    expect(document.querySelector("h1")?.getAttribute("aria-label")).toBe(currentTitle);
    act(() => vi.advanceTimersByTime(499));
    expect(document.querySelector("h1")?.getAttribute("aria-label")).toBe(currentTitle);

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("heading", { name: /what.*name\?/i })).toBeTruthy();
    expect(screen.getByText(/steps left/i)).toBeTruthy();
  });
});
