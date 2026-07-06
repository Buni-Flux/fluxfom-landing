export type ElevateWizardAnswers = {
  businessType: string | null;
  challenges: string[];
  team: string | null;
  goals: string[];
  maturity: string | null;
  vision: string | null;
  email: string;
  companyName: string;
};

export const emptyAnswers = (): ElevateWizardAnswers => ({
  businessType: null,
  challenges: [],
  team: null,
  goals: [],
  maturity: null,
  vision: null,
  email: "",
  companyName: "",
});
