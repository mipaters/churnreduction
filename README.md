# Rogers Churn Prevention Agent

*Predict the risk. Understand the reason. Make the right save.*

An executive-ready, interactive concept demonstration showing how explainable AI, governed offer decisioning, frontline assistance, and closed-loop measurement can turn churn prediction into measurable retention action.

> **Synthetic-data disclaimer:** Concept demonstration using synthetic customer, account, billing, usage, network, service, financial, sentiment, offer, and interaction data. Risk scores, recommendations, offers, financial values, and outcomes are illustrative and do not represent actual Rogers customers, production models, approved offers, or business forecasts.

The demo has no backend, authentication, live integrations, API keys, customer communications, account changes, or autonomous approvals.

## Business problem

Traditional churn programmes often stop at a score or target list. This experience connects the full decision:

1. Which customers are at risk?
2. Why are they at risk?
3. When should Rogers intervene?
4. Which governed action best fits?
5. What should the frontline employee say?
6. Did the intervention create incremental retention?

## Demo personas

- **Executive and retention leadership:** churn exposure, revenue at risk, save performance, lift over control, cost per save, campaign ROI, customer experience, and operating efficiency.
- **Frontline and operational teams:** customer context, explainable risk, urgency, next-best action, talk track, approval requirements, and outcome capture.
- **Analytics, offer, finance, model-risk, and Responsible AI teams:** model and agent versions, offer policies, lineage, controls, decision trace, drift, and outcome measurement.

## Five-agent team

| Agent | Role |
|---|---|
| Retention Supervisor Agent | Orchestrates shared workflow state, authority, escalation, final recommendation, and audit trail |
| Churn Prediction Agent | Produces multi-horizon risk, urgency, score changes, confidence, and model metadata |
| Customer 360 and Explanation Agent | Assembles context and turns synthetic signals and model drivers into inspectable explanations |
| Next-Best-Retention-Action Agent | Ranks eligible actions using churn reason, value, margin, channel, history, and policy |
| Conversation and Outcome Agent | Provides talk-track guidance and records accepted, declined, countered, saved, or churned outcomes |

Agents recommend; authorized employees decide.

## Primary customer scenario

The main walkthrough follows **Sarah Thompson**, a clearly labelled simulated Rogers wireless customer. Her illustrative 38% churn probability is explained by:

- Contract expiry in 12 days
- 847 days since the last device upgrade
- Recent service friction and negative sentiment
- No converged product relationship

The recommended synthetic treatment is a governed device upgrade, 24-month renewal, and service-recovery acknowledgement. Every simulated presentation, approval request, and outcome requires a human confirmation or explicit employee input.

## Application sections

1. Executive Retention Dashboard
2. Churn Risk Queue
3. Customer 360
4. Live Save Assist
5. Agent Decision Trace
6. Offer Intelligence
7. Campaign and Cohort Performance
8. Retention ROI
9. Executive Walkthrough
10. Microsoft Architecture
11. Governance and Controls

The app includes 18 stable synthetic customers, 12 governed synthetic offers, deterministic campaigns and control groups, a five-agent workflow, explainability views, a scripted contact-centre conversation, auditable decisions, an editable ROI calculator, light/dark modes, and responsive layouts.

## Local installation

Requires a current Node.js LTS release and npm.

```bash
npm install
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`.

Production build:

```bash
npm run build
npm run preview
```

## Repository structure

```text
.
├── src/
│   ├── App.tsx          # Routes, shared demo state, pages, components, and interactions
│   ├── data.ts          # Strongly typed deterministic synthetic data
│   ├── index.css        # Tailwind import and Rogers-inspired responsive design system
│   └── main.tsx         # React entry point
├── index.html
├── staticwebapp.config.json
├── vite.config.ts
└── package.json
```

## Executive walkthrough

Select **Executive Walkthrough** in the persistent header or floating action button. The ten-step guided presentation includes:

- Back, Next, Restart, Auto Play, Pause, and Exit controls
- Business problem and continuous scoring
- Sarah's explainable diagnosis and urgency
- Governed next-best action and employee control
- Conversation guidance and outcome capture
- Incremental lift over control
- Closed-loop Microsoft architecture

## Architecture summary

The architecture view is explicitly marked **proposed** and includes:

- **Experience:** contact-centre desktop, Dynamics 365 option, digital journeys, MyRogers option, supervisor workspace, Power BI, and Teams
- **Agent and reasoning:** Microsoft Foundry, Azure OpenAI, five retention agents, tool/API patterns, evaluation, observability, and human approval
- **Data and intelligence:** Microsoft Fabric, OneLake, Real-Time Intelligence, Eventstreams, Azure Machine Learning, churn/value models, explainability, and Azure AI Search
- **Integration:** API Management, Functions, Logic Apps, Event Hubs, secure batch/streaming, enterprise integration services, and relevant TM Forum APIs
- **Security and governance:** Microsoft Entra ID, managed identities, RBAC, Key Vault, Purview, Defender for Cloud, Azure Monitor, PII masking, and audit controls

Every connector is conceptual and subject to Rogers architecture, security, privacy, procurement, and integration approval.

## Governance model

The authority sequence is:

**Observe → Explain → Recommend → Approve → Execute → Learn**

The demonstration enforces the product story that:

- No autonomous customer-impacting action occurs
- Control-group customers cannot receive interventions
- Unapproved offers cannot be presented
- Eligibility, margin, cooldown, confidence, consent, and authority controls are visible
- Employees can inspect evidence, request approval, choose a fallback, decline, or override
- Outcomes are written only to a simulated measurement layer
- Financial estimates remain visibly illustrative

## Azure Static Web Apps deployment

The repository includes `staticwebapp.config.json` with SPA route fallback and security headers.

Create an Azure Static Web Apps resource connected to this GitHub repository and use:

| Setting | Value |
|---|---|
| App location | `/` |
| API location | *(leave blank)* |
| Output location | `dist` |
| Build command | `npm run build` |

No secrets or API keys are required by the application. Azure's generated GitHub Actions workflow can install dependencies and publish `dist`.

## Accessibility

- Semantic headings, tables, navigation, buttons, and form labels
- Visible keyboard focus states
- Accessible colour contrast in both themes
- Text labels in addition to colour for risk and status
- Responsive layouts for desktop, tablet, and mobile
- No critical interaction depends on hover
- Motion is restrained and does not block interaction

## Known production integration requirements

A production implementation would require approved contracts and controls for customer identity, CRM, billing, subscriber master, product holdings, device lifecycle, usage, network quality, contact-centre interactions, digital analytics, consent, pricing, eligibility, offer fulfilment, campaign orchestration, and outcome write-back. It would also require production-grade model validation, monitoring, security threat modelling, privacy impact assessment, accessibility testing, penetration testing, disaster recovery, service management, and operational ownership.

## Suggested next production steps

1. Confirm priority retention journeys, outcomes, decision rights, and control-group design.
2. Complete source-system, consent, data-quality, and permitted-purpose assessment.
3. Validate reason taxonomy, multi-horizon model performance, explainability, and bias controls.
4. Establish an approved offer catalogue with eligibility, margin, cooldown, and authority rules.
5. Prototype the frontline workflow inside the target contact-centre environment.
6. Run a controlled pilot with holdouts and predefined save, lift, cost, experience, and risk metrics.
7. Expand only after governance, employee adoption, customer outcomes, and incremental value are demonstrated.
