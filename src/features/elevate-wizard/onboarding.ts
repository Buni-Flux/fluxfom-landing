export type CustomerType = "creative" | "personal" | "business";

export type ProjectFormValues = {
  customerType: CustomerType | "";
  name: string;
  companyName: string;
  email: string;
  phone: string;
  preferredContactMethod: "email" | "phone" | "whatsapp" | "text" | "";
  profession: string;
  profileUrl: string;
  primaryGoal: string;
  services: string[];
  projectDescription: string;
  desiredOutcome: string;
  timeline: string;
  source?: string;
};

export type ProjectPayload = {
  customerType: CustomerType;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  preferredContactMethod: "email" | "phone" | "whatsapp" | "text";
  profession: string;
  profileUrl: string;
  primaryGoal: string;
  services: string[];
  projectDescription: string;
  desiredOutcome: string;
  timeline: string;
  title: string;
  summary: string;
};

type ProjectAuth = {
  getSession: () => Promise<{
    data: { session: { access_token: string; user: { id: string } } | null };
    error: Error | null;
  }>;
  signInAnonymously: () => Promise<{
    data: {
      user: { id: string } | null;
      session: { access_token: string } | null;
    };
    error: Error | null;
  }>;
};

export const getProjectOwner = async (auth: ProjectAuth) => {
  const { data: sessionData, error: sessionError } = await auth.getSession();
  if (sessionError) throw sessionError;
  if (sessionData.session?.access_token && sessionData.session.user.id) {
    return { userId: sessionData.session.user.id, accessToken: sessionData.session.access_token };
  }

  const { data, error } = await auth.signInAnonymously();
  if (error) throw error;
  if (!data.session?.access_token || !data.user?.id) {
    throw new Error("We could not start a secure project session. Please try again.");
  }

  return { userId: data.user.id, accessToken: data.session.access_token };
};

export const projectProgressStages = [
  { key: "request_received", label: "Request received", status: "received" },
  { key: "reviewing", label: "Reviewing", status: "reviewing" },
  { key: "strategy", label: "Strategy", status: "strategy" },
  { key: "in_progress", label: "In production", status: "in_progress" },
  { key: "awaiting_client", label: "Awaiting client", status: "awaiting_client" },
  { key: "review", label: "Final review", status: "review" },
  { key: "completed", label: "Completed", status: "completed" },
] as const;

export const getProgressStageForStatus = (status?: string | null) => {
  return projectProgressStages.find((stage) => stage.key === status) ?? projectProgressStages[0];
};

export const buildProjectPayload = (values: Partial<ProjectFormValues>): ProjectPayload => {
  const customerType = (values.customerType || "personal") as CustomerType;
  const email = (values.email ?? "").trim();
  const phone = (values.phone ?? "").trim();

  if (!email && !phone) {
    throw new Error("Please provide your email or phone number so FluxFom can reach you.");
  }

  const name = (values.name ?? "").trim();
  const companyName = (values.companyName ?? "").trim();
  const profession = (values.profession ?? "").trim();
  const profileUrl = (values.profileUrl ?? "").trim();
  const primaryGoal = (values.primaryGoal ?? "").trim() || "Understand the right next steps";
  const services = (values.services ?? []).filter(Boolean);
  const projectDescription = (values.projectDescription ?? "").trim();
  const desiredOutcome = (values.desiredOutcome ?? "").trim();
  const timeline = (values.timeline ?? "").trim();

  const preferredContactMethod = (values.preferredContactMethod || (email ? "email" : "phone")) as ProjectPayload["preferredContactMethod"];
  const displayName = name || companyName || "New client";

  const title =
    companyName && customerType !== "personal"
      ? `${companyName} project request`
      : `${displayName} project request`;

  const summary = [
    services.length ? services.join(" • ") : "Project request",
    primaryGoal,
    desiredOutcome || projectDescription || "Need a clear next step from FluxFom.",
  ].join(" — ");

  return {
    customerType,
    name: displayName,
    companyName,
    email,
    phone,
    preferredContactMethod,
    profession,
    profileUrl,
    primaryGoal,
    services,
    projectDescription,
    desiredOutcome,
    timeline,
    title,
    summary,
  };
};

export const buildProjectMilestones = (projectId: string) => [
  {
    project_id: projectId,
    key: "request_received",
    title: "Request received",
    description: "We’ve received your brief and are reviewing the information you shared.",
    status: "received",
    display_order: 1,
  },
  {
    project_id: projectId,
    key: "reviewing",
    title: "FluxFom reviewing your project",
    description: "Our team is confirming scope, direction, and what we need from you.",
    status: "reviewing",
    display_order: 2,
  },
  {
    project_id: projectId,
    key: "strategy",
    title: "Strategy",
    description: "We’ll shape the next steps, priorities, and your recommended path forward.",
    status: "upcoming",
    display_order: 3,
  },
  {
    project_id: projectId,
    key: "in_progress",
    title: "Production",
    description: "FluxFom moves into the project work you asked for.",
    status: "upcoming",
    display_order: 4,
  },
  {
    project_id: projectId,
    key: "review",
    title: "Final review",
    description: "Your work is refined and checked before it’s wrapped up.",
    status: "upcoming",
    display_order: 5,
  },
  {
    project_id: projectId,
    key: "completed",
    title: "Completed",
    description: "Your project is complete and ready to use.",
    status: "upcoming",
    display_order: 6,
  },
];

export const buildProjectDeliverables = (projectId: string, services: string[] = []) => {
  const selectedServices = services.length > 0 ? services : ["Project brief"];

  return selectedServices.slice(0, 3).map((service, index) => ({
    project_id: projectId,
    title: service,
    description: "This deliverable will be shaped based on your project brief and next steps.",
    status: index === 0 ? "in_progress" : "upcoming",
    display_order: index + 1,
  }));
};
