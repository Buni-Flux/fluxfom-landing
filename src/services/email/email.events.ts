import type { ReactElement } from 'react';

import { WelcomeEmail } from './onboarding/WelcomeEmail';
import { VerifyEmail } from './onboarding/VerifyEmail';
import { BrandAnalysisReadyEmail } from './intelligence/BrandAnalysisReadyEmail';
import { CampaignPublishedEmail } from './marketing/CampaignPublishedEmail';
import { ProjectCompletedEmail } from './production/ProjectCompletedEmail';
import { InvoiceGeneratedEmail } from './billing/InvoiceGeneratedEmail';
import { WeeklySummaryEmail } from './analytics/WeeklySummaryEmail';
import { AIRecommendationEmail } from './future/AIRecommendationEmail';
import { renderEmailTemplate } from './render';
import type {
  AIRecommendationEmailProps,
  BrandAnalysisReadyEmailProps,
  CampaignPublishedEmailProps,
  InvoiceGeneratedEmailProps,
  ProjectCompletedEmailProps,
  VerifyEmailProps,
  WeeklySummaryEmailProps,
  WelcomeEmailProps,
} from './email.types';

export enum EMAIL_EVENTS {
  WELCOME = 'WELCOME',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  WORKSPACE_CREATED = 'WORKSPACE_CREATED',
  PROFILE_COMPLETED = 'PROFILE_COMPLETED',
  FIRST_ANALYSIS_STARTED = 'FIRST_ANALYSIS_STARTED',
  WORKSPACE_READY = 'WORKSPACE_READY',
  AGENCY_ASSIGNED = 'AGENCY_ASSIGNED',
  INVITATION_ACCEPTED = 'INVITATION_ACCEPTED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  MAGIC_LINK = 'MAGIC_LINK',
  LOGIN_ALERT = 'LOGIN_ALERT',
  BRAND_ANALYSIS_STARTED = 'BRAND_ANALYSIS_STARTED',
  BRAND_ANALYSIS_READY = 'BRAND_ANALYSIS_READY',
  COMPETITOR_ANALYSIS_READY = 'COMPETITOR_ANALYSIS_READY',
  AUDIENCE_RESEARCH_READY = 'AUDIENCE_RESEARCH_READY',
  MESSAGING_STRATEGY_READY = 'MESSAGING_STRATEGY_READY',
  BRAND_POSITIONING_READY = 'BRAND_POSITIONING_READY',
  BRAND_SCORE_UPDATED = 'BRAND_SCORE_UPDATED',
  GROWTH_OPPORTUNITIES_FOUND = 'GROWTH_OPPORTUNITIES_FOUND',
  MARKET_SHIFT_DETECTED = 'MARKET_SHIFT_DETECTED',
  INDUSTRY_BENCHMARK_UPDATED = 'INDUSTRY_BENCHMARK_UPDATED',
  BRAND_HEALTH_CHECK = 'BRAND_HEALTH_CHECK',
  AI_STRATEGIC_SUMMARY = 'AI_STRATEGIC_SUMMARY',
  CAMPAIGN_CREATED = 'CAMPAIGN_CREATED',
  CAMPAIGN_SCHEDULED = 'CAMPAIGN_SCHEDULED',
  CAMPAIGN_PUBLISHED = 'CAMPAIGN_PUBLISHED',
  CAMPAIGN_PERFORMANCE_UPDATE = 'CAMPAIGN_PERFORMANCE_UPDATE',
  CAMPAIGN_UNDERPERFORMING = 'CAMPAIGN_UNDERPERFORMING',
  CAMPAIGN_FINISHED = 'CAMPAIGN_FINISHED',
  CONTENT_CALENDAR_READY = 'CONTENT_CALENDAR_READY',
  SOCIAL_ASSETS_READY = 'SOCIAL_ASSETS_READY',
  MOTION_ASSETS_READY = 'MOTION_ASSETS_READY',
  COPYWRITING_READY = 'COPYWRITING_READY',
  MARKETING_PLAN_READY = 'MARKETING_PLAN_READY',
  SEO_OPPORTUNITIES_FOUND = 'SEO_OPPORTUNITIES_FOUND',
  PROJECT_CREATED = 'PROJECT_CREATED',
  DESIGNER_ASSIGNED = 'DESIGNER_ASSIGNED',
  COPYWRITER_ASSIGNED = 'COPYWRITER_ASSIGNED',
  MOTION_DESIGNER_ASSIGNED = 'MOTION_DESIGNER_ASSIGNED',
  REVISION_REQUESTED = 'REVISION_REQUESTED',
  REVISION_COMPLETED = 'REVISION_COMPLETED',
  ASSET_DELIVERY = 'ASSET_DELIVERY',
  PROJECT_COMPLETED = 'PROJECT_COMPLETED',
  APPROVAL_REQUESTED = 'APPROVAL_REQUESTED',
  CLIENT_FEEDBACK_RECEIVED = 'CLIENT_FEEDBACK_RECEIVED',
  TRIAL_STARTED = 'TRIAL_STARTED',
  TRIAL_ENDING = 'TRIAL_ENDING',
  INVOICE_GENERATED = 'INVOICE_GENERATED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  SUBSCRIPTION_RENEWED = 'SUBSCRIPTION_RENEWED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  SUBSCRIPTION_CANCELLED = 'SUBSCRIPTION_CANCELLED',
  QUOTE_READY = 'QUOTE_READY',
  PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
  WEEKLY_SUMMARY = 'WEEKLY_SUMMARY',
  MONTHLY_PERFORMANCE_REVIEW = 'MONTHLY_PERFORMANCE_REVIEW',
  QUARTERLY_STRATEGY_REPORT = 'QUARTERLY_STRATEGY_REPORT',
  CAMPAIGN_INSIGHTS = 'CAMPAIGN_INSIGHTS',
  BRAND_GROWTH_REPORT = 'BRAND_GROWTH_REPORT',
  COMPETITIVE_LANDSCAPE_CHANGES = 'COMPETITIVE_LANDSCAPE_CHANGES',
  AUDIENCE_BEHAVIOUR_CHANGES = 'AUDIENCE_BEHAVIOUR_CHANGES',
  AI_RECOMMENDATION = 'AI_RECOMMENDATION',
  AI_DETECTED_TREND = 'AI_DETECTED_TREND',
  NEW_COMPETITOR_ALERT = 'NEW_COMPETITOR_ALERT',
  CONTENT_OPPORTUNITY = 'CONTENT_OPPORTUNITY',
  BRAND_CONSISTENCY_IMPROVED = 'BRAND_CONSISTENCY_IMPROVED',
  CUSTOMER_SENTIMENT_SHIFT = 'CUSTOMER_SENTIMENT_SHIFT',
  MARKETING_OPPORTUNITY = 'MARKETING_OPPORTUNITY',
  GROWTH_OPPORTUNITY = 'GROWTH_OPPORTUNITY',
  AUTOMATION_COMPLETED = 'AUTOMATION_COMPLETED',
  PREDICTIVE_INSIGHT = 'PREDICTIVE_INSIGHT',
}

export type EmailEventName = keyof EmailPropsMap;

export interface EmailPropsMap {
  [EMAIL_EVENTS.WELCOME]: WelcomeEmailProps;
  [EMAIL_EVENTS.VERIFY_EMAIL]: VerifyEmailProps;
  [EMAIL_EVENTS.BRAND_ANALYSIS_READY]: BrandAnalysisReadyEmailProps;
  [EMAIL_EVENTS.CAMPAIGN_PUBLISHED]: CampaignPublishedEmailProps;
  [EMAIL_EVENTS.PROJECT_COMPLETED]: ProjectCompletedEmailProps;
  [EMAIL_EVENTS.INVOICE_GENERATED]: InvoiceGeneratedEmailProps;
  [EMAIL_EVENTS.WEEKLY_SUMMARY]: WeeklySummaryEmailProps;
  [EMAIL_EVENTS.AI_RECOMMENDATION]: AIRecommendationEmailProps;
}

async function renderTemplate(event: EmailEventName, props: EmailPropsMap[EmailEventName]): Promise<{ subject: string; html: string; text: string }> {
  const templates: Record<EmailEventName, (props: EmailPropsMap[EmailEventName]) => ReactElement> = {
    [EMAIL_EVENTS.WELCOME]: (props) => WelcomeEmail(props as WelcomeEmailProps),
    [EMAIL_EVENTS.VERIFY_EMAIL]: (props) => VerifyEmail(props as VerifyEmailProps),
    [EMAIL_EVENTS.BRAND_ANALYSIS_READY]: (props) => BrandAnalysisReadyEmail(props as BrandAnalysisReadyEmailProps),
    [EMAIL_EVENTS.CAMPAIGN_PUBLISHED]: (props) => CampaignPublishedEmail(props as CampaignPublishedEmailProps),
    [EMAIL_EVENTS.PROJECT_COMPLETED]: (props) => ProjectCompletedEmail(props as ProjectCompletedEmailProps),
    [EMAIL_EVENTS.INVOICE_GENERATED]: (props) => InvoiceGeneratedEmail(props as InvoiceGeneratedEmailProps),
    [EMAIL_EVENTS.WEEKLY_SUMMARY]: (props) => WeeklySummaryEmail(props as WeeklySummaryEmailProps),
    [EMAIL_EVENTS.AI_RECOMMENDATION]: (props) => AIRecommendationEmail(props as AIRecommendationEmailProps),
  };

  const template = templates[event];

  if (!template) {
    const fallback = WelcomeEmail({ clientName: 'there', workspaceName: 'FluxFom', dashboardUrl: 'https://fluxfom.app' } as WelcomeEmailProps);
    return renderEmailTemplate(fallback);
  }

  const element = template(props);
  return renderEmailTemplate(element);
}

const subjectMap: Partial<Record<EmailEventName, string>> = {
  [EMAIL_EVENTS.WELCOME]: 'Welcome to FluxFom',
  [EMAIL_EVENTS.VERIFY_EMAIL]: 'Verify your email',
  [EMAIL_EVENTS.BRAND_ANALYSIS_READY]: 'Brand Intelligence ready · FluxFom',
  [EMAIL_EVENTS.CAMPAIGN_PUBLISHED]: 'Campaign published · FluxFom',
  [EMAIL_EVENTS.PROJECT_COMPLETED]: 'Project completed · FluxFom',
  [EMAIL_EVENTS.INVOICE_GENERATED]: 'Invoice generated · FluxFom',
  [EMAIL_EVENTS.WEEKLY_SUMMARY]: 'Weekly summary · FluxFom',
  [EMAIL_EVENTS.AI_RECOMMENDATION]: 'AI recommendation · FluxFom',
};

export async function dispatchEmailEvent<T extends EmailEventName>(event: T, props: EmailPropsMap[T]): Promise<{ subject: string; html: string; text: string }> {
  const rendered = await renderTemplate(event, props as EmailPropsMap[EmailEventName]);
  const normalizedSubject = rendered.subject === 'FluxFom update' ? subjectMap[event] ?? `${event.replace(/_/g, ' ').toLowerCase()} · FluxFom` : rendered.subject;

  return {
    subject: normalizedSubject,
    html: rendered.html,
    text: rendered.text,
  };
}
