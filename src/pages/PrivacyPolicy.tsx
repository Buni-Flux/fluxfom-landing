import { motion } from "framer-motion";
import { ScrollNudge } from "@/components/marketing/ScrollNudge";

const PRIVACY_HERO_IMAGE =
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2400&q=80";
const PRIVACY_HERO_ALT = "Aerial view of a multi-lane motorway with moving traffic flowing through a city skyline.";

type SubSection = {
  title: string;
  items?: string[];
  body?: string[];
};

type Section = {
  title: string;
  body?: string[];
  subsections?: SubSection[];
};

const getSectionId = (title: string) =>
  title
    .toLowerCase()
    .replace(/^[0-9.\s]+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const sections: Section[] = [
  {
    title: "Overview",
    body: [
      "FluxFom (\"FluxFom\", \"we\", \"us\", or \"our\") respects your privacy and is committed to protecting personal data entrusted to us.",
      "This Privacy Policy explains how FluxFom collects, uses, stores, shares, protects and otherwise processes personal data when you:",
    ],
    subsections: [
      {
        title: "",
        items: [
          "visit or interact with our websites;",
          "use FluxFom products, platforms or digital experiences;",
          "create or manage a FluxFom account;",
          "submit information through our \"Get Started\" or onboarding experiences;",
          "contact us;",
          "request, purchase or receive our services;",
          "communicate with our team;",
          "participate in our marketing, campaigns, events or research;",
          "interact with us through social media or other third-party platforms;",
          "provide information to us as a client, prospective client, supplier, partner, employee, contractor or other business contact; or",
          "interact with services where FluxFom processes information on behalf of one of our clients.",
        ],
      },
    ],
  },
  {
    title: "1. Who We Are",
    body: [
      "FluxFom is a digital marketing, branding, design, creative technology and digital services business.",
      "Our services may include, depending on the service engaged:",
    ],
    subsections: [
      {
        title: "",
        items: [
          "brand strategy and positioning;",
          "brand identity and visual communication;",
          "website and digital experience design;",
          "digital marketing;",
          "social media strategy and content;",
          "creative campaigns;",
          "marketing materials;",
          "content development;",
          "digital products and platforms;",
          "client onboarding and discovery;",
          "competitive and market research;",
          "brand intelligence;",
          "AI-assisted creative and strategic tools;",
          "workflow and business automation;",
          "digital consultancy;",
          "analytics and reporting;",
          "hosting or operation of client-facing digital experiences; and",
          "other related creative, marketing, technology and consulting services.",
        ],
      },
    ],
  },
  {
    title: "2. Our Role Under Data Protection Law",
    body: [
      "Depending on the circumstances, FluxFom may act as either a Data Controller, Data Processor, or both.",
    ],
    subsections: [
      {
        title: "2.1 When FluxFom is a Data Controller",
        body: [
          "FluxFom is generally a Data Controller when we determine why and how personal data is processed for our own business purposes.",
          "Examples include personal information submitted through:",
        ],
        items: [
          "our website;",
          "contact forms;",
          "enquiries;",
          "account registration;",
          "service onboarding;",
          "newsletter or marketing subscriptions;",
          "recruitment applications;",
          "event registrations;",
          "customer support;",
          "business communications; and",
          "our own marketing and analytics activities.",
        ],
      },
      {
        title: "2.2 When FluxFom is a Data Processor",
        body: [
          "FluxFom may act as a Data Processor where a client determines the purposes and means of processing personal data and engages FluxFom to process that information on the client's behalf.",
          "For example, a client may engage FluxFom to:",
        ],
        items: [
          "manage digital marketing campaigns;",
          "develop or operate a website;",
          "manage customer or audience information;",
          "create marketing databases;",
          "perform campaign analysis;",
          "manage social media information;",
          "operate automated workflows;",
          "create customer-facing digital experiences;",
          "process enquiries or leads;",
          "generate reports; or",
          "perform other services involving personal data.",
        ],
      },
    ],
  },
  {
    title: "3. The Personal Data We May Collect",
    body: [
      "The type of information we collect depends on how you interact with FluxFom.",
      "We seek to collect only information that is reasonably necessary for the relevant purpose.",
    ],
    subsections: [
      {
        title: "3.1 Identity and contact information",
        body: [
          "This may include:",
        ],
        items: [
          "name;",
          "username;",
          "email address;",
          "telephone number;",
          "business name;",
          "job title or role;",
          "social media handles;",
          "professional profile information;",
          "postal or business address;",
          "country or general location; and",
          "other information you voluntarily provide.",
        ],
      },
      {
        title: "3.2 Account information",
        body: [
          "Where FluxFom provides accounts or authenticated experiences, we may collect:",
        ],
        items: [
          "account email address;",
          "account identifiers;",
          "authentication information;",
          "profile information;",
          "account preferences;",
          "roles and permissions;",
          "account activity;",
          "security information; and",
          "information associated with your use of the relevant service.",
        ],
      },
      {
        title: "3.3 Business and client information",
        body: [
          "If you engage FluxFom professionally, we may collect information such as:",
        ],
        items: [
          "company or organisation name;",
          "business description;",
          "industry;",
          "business objectives;",
          "marketing objectives;",
          "target audiences;",
          "brand information;",
          "competitors;",
          "campaign information;",
          "budgets or commercial information;",
          "project requirements;",
          "communication preferences;",
          "project contacts;",
          "invoices and payment-related information;",
          "contractual information; and",
          "information contained in materials supplied to us.",
        ],
      },
      {
        title: "3.4 Information submitted through onboarding",
        body: [
          "FluxFom may provide interactive onboarding or \"Get Started\" experiences designed to understand a client's business, brand and objectives.",
          "Information submitted through these experiences may include:",
        ],
        items: [
          "personal contact details;",
          "business information;",
          "brand information;",
          "customer information;",
          "target audience information;",
          "marketing challenges;",
          "business goals;",
          "product or service information;",
          "competitors;",
          "website and social media information;",
          "creative preferences;",
          "uploaded materials;",
          "links;",
          "campaign information; and",
          "other information voluntarily submitted.",
        ],
      },
      {
        title: "3.5 Content and files",
        body: [
          "Depending on the service, you may provide:",
        ],
        items: [
          "photographs;",
          "videos;",
          "logos;",
          "brand assets;",
          "documents;",
          "presentations;",
          "artwork;",
          "product information;",
          "marketing materials;",
          "customer research;",
          "spreadsheets;",
          "datasets;",
          "website content;",
          "social media content;",
          "audio or other media; and",
          "other files or information.",
        ],
      },
      {
        title: "3.6 Technical and usage information",
        body: [
          "When you interact with our websites, applications or digital services, we may automatically receive certain technical information, which may include:",
        ],
        items: [
          "IP address;",
          "browser type;",
          "device type;",
          "operating system;",
          "approximate geographic information;",
          "referring website;",
          "pages visited;",
          "interactions with our website;",
          "timestamps;",
          "session information;",
          "diagnostic information;",
          "security logs;",
          "error information; and",
          "information about how our services are used.",
        ],
      },
    ],
  },
  {
    title: "4. Information We Receive From Other Sources",
    body: [
      "We may receive personal data from sources other than directly from you.",
      "These may include:",
    ],
    subsections: [
      {
        title: "",
        items: [
          "our clients;",
          "business partners;",
          "service providers;",
          "publicly available business information;",
          "social media platforms;",
          "marketing platforms;",
          "advertising platforms;",
          "analytics providers;",
          "professional directories;",
          "referrals;",
          "publicly accessible websites; and",
          "other lawful sources.",
        ],
      },
    ],
  },
  {
    title: "5. How We Use Personal Data",
    subsections: [
      {
        title: "5.1 Providing our services",
        body: [
          "We may use personal data to:",
        ],
        items: [
          "provide requested services;",
          "communicate about projects;",
          "create and manage client accounts;",
          "deliver creative and marketing work;",
          "provide technical support;",
          "operate digital products;",
          "operate client portals;",
          "manage projects;",
          "generate reports;",
          "respond to requests; and",
          "fulfil our contractual obligations.",
        ],
      },
      {
        title: "5.2 Client onboarding and discovery",
        body: [
          "We may use information submitted during onboarding to:",
        ],
        items: [
          "understand your business;",
          "understand your goals;",
          "identify business and marketing challenges;",
          "conduct research;",
          "understand positioning;",
          "develop brand strategy;",
          "identify relevant competitors;",
          "develop creative direction;",
          "prepare proposals;",
          "recommend services; and",
          "establish an appropriate scope of work.",
        ],
      },
      {
        title: "5.3 Marketing and communications",
        body: [
          "Where legally permitted, we may use contact information to:",
        ],
        items: [
          "send service-related communications;",
          "respond to enquiries;",
          "provide updates;",
          "share relevant FluxFom information;",
          "send newsletters;",
          "communicate about events;",
          "send marketing communications; and",
          "understand engagement with our communications.",
        ],
      },
      {
        title: "5.4 Improving FluxFom",
        body: [
          "We may use information to:",
        ],
        items: [
          "improve our services;",
          "understand how our platforms are used;",
          "identify technical problems;",
          "develop new products;",
          "improve user experiences;",
          "evaluate marketing performance;",
          "conduct internal research;",
          "improve workflows; and",
          "maintain the security and reliability of our services.",
        ],
      },
      {
        title: "5.5 Security and fraud prevention",
        body: [
          "We may process information to:",
        ],
        items: [
          "authenticate users;",
          "protect accounts;",
          "prevent unauthorised access;",
          "investigate security incidents;",
          "detect misuse;",
          "maintain system integrity;",
          "protect our services and users; and",
          "comply with security obligations.",
        ],
      },
      {
        title: "5.6 Legal and regulatory purposes",
        body: [
          "We may process personal data where necessary to:",
        ],
        items: [
          "comply with applicable laws;",
          "respond to lawful requests;",
          "establish or defend legal claims;",
          "maintain business records;",
          "satisfy accounting requirements;",
          "meet regulatory obligations;",
          "enforce contractual terms; or",
          "protect our legal rights.",
        ],
      },
    ],
  },
  {
    title: "6. Our Legal Bases for Processing",
    body: [
      "Depending on the circumstances, FluxFom may process personal data on one or more lawful bases recognised under applicable data protection law.",
      "These may include:",
    ],
    subsections: [
      {
        title: "Consent",
        body: [
          "Where required, we may ask for your consent before processing personal data for a particular purpose.",
          "You may withdraw consent where applicable. Withdrawal of consent does not necessarily affect processing that occurred lawfully before withdrawal.",
        ],
      },
      {
        title: "Contract",
        body: [
          "We may process information where necessary to enter into or perform a contract with you.",
        ],
      },
      {
        title: "Legal obligation",
        body: [
          "We may process information where necessary to comply with a legal or regulatory obligation.",
        ],
      },
      {
        title: "Legitimate interests",
        body: [
          "We may process information where necessary for legitimate business interests, provided that those interests do not override applicable rights and protections.",
          "Examples may include:",
        ],
        items: [
          "maintaining service security;",
          "improving services;",
          "communicating with existing business contacts;",
          "preventing misuse;",
          "maintaining business operations; and",
          "protecting our legal interests.",
        ],
      },
      {
        title: "Other lawful bases",
        body: [
          "Where applicable law provides additional lawful bases, FluxFom may rely on those bases where appropriate.",
        ],
      },
    ],
  },
  {
    title: "7. Consent",
    body: [
      "Where processing relies on consent, we aim to obtain consent through a clear and transparent request at the point of collection.",
      "Consent may be required for certain marketing communications, optional analytics features, or other processing activities where local law requires it.",
      "If you have provided consent for a specific purpose, you can withdraw that consent at any time where the mechanism for withdrawal is available. Withdrawal will not affect processing already carried out on a lawful basis before the withdrawal.",
    ],
  },
  {
    title: "8. Data Retention",
    body: [
      "We retain personal data only for as long as necessary to fulfil the purposes for which it was collected, to satisfy legal or regulatory obligations, to resolve disputes, and to enforce our agreements.",
      "The retention period may vary depending on the type of information, the service involved, and the applicable legal requirements. When personal data is no longer needed, we will securely delete or anonymise it where practicable.",
    ],
  },
  {
    title: "9. Sharing and Disclosure",
    body: [
      "We may share personal data with trusted service providers, contractors, partners, hosting providers, analytics providers, or other third parties where necessary to deliver our services, operate our systems, support marketing or CRM activities, provide infrastructure, or comply with legal obligations.",
      "We may also disclose personal data where required by law, court order, regulatory request, or to protect the rights, safety or property of FluxFom, our users, or others.",
      "Where we engage third parties, we seek to ensure they process personal data in a lawful, secure and contractually controlled manner.",
    ],
  },
  {
    title: "10. International Transfers",
    body: [
      "FluxFom may transfer personal data to countries outside your jurisdiction in connection with our services, infrastructure, business operations or communications.",
      "We will apply appropriate safeguards, contractual terms and operational controls to help protect personal data during any such transfer.",
    ],
  },
  {
    title: "11. Security",
    body: [
      "We implement reasonable technical, organisational and administrative measures designed to protect personal data from unauthorised access, loss, misuse, alteration or disclosure.",
      "However, no system is completely secure. While we take steps to protect information, we cannot guarantee the absolute security of data transmitted over the internet or stored electronically.",
    ],
  },
  {
    title: "12. Your Rights",
    body: [
      "Depending on the jurisdiction in which you live, you may have rights in relation to your personal data, including the right to access, correct, erase, restrict, transfer or object to processing, and the right to withdraw consent where consent is the basis of processing.",
      "If you wish to exercise a right or ask a question about your personal data, please contact us through the channels provided on our website or by reaching out to our team through the appropriate contact form or business contact details in use at the time of communication.",
      "Where permitted by law, we may decline requests that are excessive, manifestly unfounded, or would otherwise prejudice the rights of others.",
    ],
  },
  {
    title: "13. Cookies and Tracking",
    body: [
      "Our websites and digital services may use cookies, pixels, local storage or similar technologies to operate our services, remember preferences, analyse usage and support security, analytics and marketing activities.",
      "The exact technologies used may vary by website or product, and additional notices may be provided where required. You can manage your browser settings to block or delete cookies, although some parts of our services may not function properly if cookies are disabled.",
    ],
  },
  {
    title: "14. Children’s Privacy",
    body: [
      "FluxFom does not intentionally collect personal data from children without the necessary parental or guardian consent, where required by applicable law.",
      "If you believe we have collected personal data from a child in error, please contact us so we can take appropriate action.",
    ],
  },
  {
    title: "15. Contact Us",
    body: [
      "If you have questions, concerns, requests, or complaints about this Privacy Policy or how FluxFom handles your personal data, please contact us through the channels provided on our website or by reaching out to our team through the appropriate contact form or business contact details in use at the time of communication.",
      "We will review and respond to privacy-related requests in line with applicable law and our internal procedures.",
    ],
  },
];

const tocItems = sections.map((section) => ({
  label: section.title,
  href: `#${getSectionId(section.title)}`,
}));

const PrivacyPolicy = () => (
  <div className="min-h-full bg-flux-void text-white">
    <section className="landing-page-shell border-b border-white/10 pb-16 pt-12 md:pb-20 md:pt-16">
      <div className="container mx-auto max-w-6xl px-5 text-center sm:px-6">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="landing-page-kicker">
          Legal
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="heading-editorial mt-4 text-4xl font-semibold text-white sm:text-5xl md:text-6xl"
        >
          Privacy Policy
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-4 text-sm font-medium text-white/70">
          Effective Date: October 3, 2026 • Last Updated: October 3, 2026
        </motion.p>
        <ScrollNudge targetId="privacy-body" tone="dark" />
      </div>
    </section>

    <figure className="border-y border-white/10 bg-[#07140b]">
      <div className="relative mx-auto aspect-[21/9] max-h-[200px] w-full max-w-6xl overflow-hidden sm:max-h-[240px] md:max-h-[280px]">
        <img
          src={PRIVACY_HERO_IMAGE}
          alt={PRIVACY_HERO_ALT}
          width={2400}
          height={900}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-[center_55%] opacity-70 saturate-[0.9]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-flux-forest/50 via-transparent to-flux-void/30" aria-hidden />
      </div>
      <figcaption className="container mx-auto max-w-6xl px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-flux-neon sm:px-6">
        Studio rooted in Nairobi
      </figcaption>
    </figure>

    <section id="privacy-body" className="scroll-mt-24 bg-flux-void py-16 pb-28 md:py-20 md:pb-32">
      <div className="container mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-sm">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-flux-neon">On this page</p>
              <nav aria-label="Privacy policy table of contents" className="space-y-2">
                {tocItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm text-white/72 transition hover:border-white/10 hover:bg-white/[0.02] hover:text-white"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-flux-neon/70 transition group-hover:bg-flux-neon" aria-hidden="true" />
                    <span className="line-clamp-2">{item.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="mx-auto w-full max-w-3xl space-y-5"
          >
            {sections.map((section) => (
              <article key={section.title} id={getSectionId(section.title)} className="landing-page-card p-6">
                <h2 className="heading-editorial text-xl font-semibold text-white">{section.title}</h2>

                {section.body && (
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/72 sm:text-base">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {section.subsections && (
                  <div className="mt-6 space-y-5">
                    {section.subsections.map((subsection, index) => (
                      <div key={`${section.title}-${subsection.title || index}`} className="space-y-3 border-t border-white/10 pt-4">
                        {subsection.title && (
                          <h3 className="text-base font-semibold text-white sm:text-lg">{subsection.title}</h3>
                        )}

                        {subsection.body && (
                          <div className="space-y-3 text-sm leading-relaxed text-white/72 sm:text-base">
                            {subsection.body.map((paragraph) => (
                              <p key={paragraph}>{paragraph}</p>
                            ))}
                          </div>
                        )}

                        {subsection.items && (
                          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/72 sm:text-base">
                            {subsection.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  </div>
);

export default PrivacyPolicy;
