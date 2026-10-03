// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ElevateBrandWizard } from "./ElevateBrandWizard";
import { buildProjectPayload, projectProgressStages } from "./onboarding";

afterEach(() => {
  cleanup();
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

describe("ElevateBrandWizard", () => {
  it("shows a single-question conversational progress indicator", () => {
    render(React.createElement(MemoryRouter, null, React.createElement(ElevateBrandWizard)));

    expect(screen.getByText(/questions left/i)).toBeTruthy();
    expect(screen.getByText(/what best describes you\?/i)).toBeTruthy();
  });

  it("reveals the next prompt after choosing the customer type", () => {
    render(React.createElement(MemoryRouter, null, React.createElement(ElevateBrandWizard)));

    fireEvent.click(screen.getAllByRole("button", { name: /i’m here for myself/i })[0]);

    expect(screen.getByText(/what.*name\?/i)).toBeTruthy();
    expect(screen.getByText(/questions left/i)).toBeTruthy();
  });
});
