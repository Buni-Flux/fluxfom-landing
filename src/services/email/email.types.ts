import type { ReactElement } from 'react';

export interface EmailRecipient {
  address: string;
  name?: string;
}

export type EmailRecipients = string | EmailRecipient | Array<string | EmailRecipient>;

export interface EmailTemplateResult {
  subject: string;
  html: string;
  text: string;
}

export interface EmailTemplateDefinition<TProps extends object> {
  subject: string | ((props: TProps) => string);
  render: (props: TProps) => ReactElement;
}

export interface EmailTemplateBaseProps {
  clientName?: string;
  brandName?: string;
  workspaceName?: string;
  reportName?: string;
  campaignName?: string;
  projectName?: string;
  invoiceNumber?: string;
  amount?: string;
  score?: number;
  industry?: string;
  competitors?: Competitor[];
  opportunities?: string[];
  brandHealth?: string;
  analysisDate?: string;
  dashboardUrl?: string;
  assetUrl?: string;
  supportEmail?: string;
}

export interface Competitor {
  name: string;
  description: string;
}

export interface WelcomeEmailProps extends EmailTemplateBaseProps {
  clientName: string;
  workspaceName: string;
  dashboardUrl: string;
}

export interface VerifyEmailProps extends EmailTemplateBaseProps {
  clientName: string;
  verificationUrl: string;
}

export interface WorkspaceCreatedEmailProps extends EmailTemplateBaseProps {
  clientName: string;
  workspaceName: string;
  dashboardUrl: string;
}

export interface ProfileCompletedEmailProps extends EmailTemplateBaseProps {
  clientName: string;
  brandName: string;
  dashboardUrl: string;
}

export interface BrandAnalysisReadyEmailProps extends EmailTemplateBaseProps {
  clientName: string;
  brandName: string;
  overallScore: number;
  opportunities: string[];
  competitors: Competitor[];
  dashboardUrl: string;
  analysisDate?: string;
}

export interface CampaignPublishedEmailProps extends EmailTemplateBaseProps {
  clientName: string;
  campaignName: string;
  dashboardUrl: string;
  industry?: string;
}

export interface ProjectCompletedEmailProps extends EmailTemplateBaseProps {
  clientName: string;
  projectName: string;
  assetUrl: string;
  dashboardUrl: string;
}

export interface InvoiceGeneratedEmailProps extends EmailTemplateBaseProps {
  clientName: string;
  invoiceNumber: string;
  amount: string;
  dashboardUrl: string;
}

export interface WeeklySummaryEmailProps extends EmailTemplateBaseProps {
  clientName: string;
  campaignName?: string;
  score?: number;
  opportunities?: string[];
  dashboardUrl: string;
}

export interface AIRecommendationEmailProps extends EmailTemplateBaseProps {
  clientName: string;
  brandName: string;
  opportunities: string[];
  dashboardUrl: string;
}
