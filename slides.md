---
marp: true
theme: aedis
paginate: true
size: 16:9
title: Aedis — Agentic OS for Healthcare
description: Andrew → Ensign Group tech team, May 2026
author: Andrew Pearson
---

<!-- _class: title -->
<!--
Speaker notes (Andrew):
- This is the architecture-first version of the Aedis pitch. Audience is Ensign's CTO and tech team, not Barry.
- Lead with credibility, not vision. They will probe every claim.
- Today is April 30, 2026. Walk in calm; the deck does the work.
- Goal: leave with a credential handoff (PCC OAuth, Workday tenant, M365 app reg) and a 30-day engagement scoped.
-->

# Aedis
## The Agentic OS for Healthcare

<div class="meta">
Andrew Pearson · Ensign Group tech team · May 2026 <br/>
goforit5.github.io/Aedis · andrew@taskvisory.com
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Anchor pitch. One sentence. Don't over-explain.
- The CTO already pays for these systems — name them. Make it concrete.
- Avoid "AI" hype words. Stay technical.
- The next slide concretizes "what Ensign uses today".
-->

# Every SaaS is three things.
## A database, a UI, and an API.

<div class="quote">
Agents don't need the UI. They talk to the data.
</div>

<div class="grid cols-3" style="margin-top:32px">
  <div class="card">
    <div class="label">Database</div>
    <div class="value">Where the truth lives</div>
    <div class="body">Postgres, SQL Server, proprietary stores. Resident records, GL, employee files.</div>
  </div>
  <div class="card">
    <div class="label">UI</div>
    <div class="value">For human operators</div>
    <div class="body">Forms, dashboards, click-paths. Built for one user at a time.</div>
  </div>
  <div class="card">
    <div class="label">API</div>
    <div class="value">For machines</div>
    <div class="body">REST, SOAP, FHIR, OData. Already there. Already governed by the vendor.</div>
  </div>
</div>

<div class="footnote">
Aedis works at the API layer. The UI is for humans who need to <em>review</em> agent decisions, not <em>operate</em> the SaaS.
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Name every system. Show you've done the homework.
- Don't editorialize; let them see the surface area themselves.
- If asked "what about Sage / Relias / etc." — yes, same pattern, just a connector to write.
-->

# What Ensign runs today
## Six surface areas, six API stacks.

<table>
<thead>
<tr><th>System</th><th>Domain</th><th>Integration surface</th><th>Auth</th></tr>
</thead>
<tbody>
<tr><td><strong>PointClickCare</strong></td><td>Clinical / EHR</td><td>FHIR R4 + proprietary REST</td><td>OAuth 2.0 (client credentials)</td></tr>
<tr><td><strong>Workday</strong></td><td>HR · Payroll · GL</td><td>REST + RaaS reports + WQL</td><td>OAuth 2.0 (tenant-scoped)</td></tr>
<tr><td><strong>Microsoft 365</strong></td><td>Mail · Calendar · Files</td><td>Graph API v1.0</td><td>Azure AD app reg + delegated/app perms</td></tr>
<tr><td><strong>SharePoint</strong></td><td>Documents · Policies</td><td>Graph + REST</td><td>Same Azure AD app</td></tr>
<tr><td><strong>Internal SQL</strong></td><td>Analytics · Custom</td><td>JDBC / ODBC / direct connect</td><td>SQL auth or Entra ID</td></tr>
<tr><td><strong>CMS · OIG · SAM</strong></td><td>Regulatory</td><td>Public REST</td><td>API key (free)</td></tr>
</tbody>
</table>

<div class="row" style="margin-top:24px">
  <span class="pill ink">~ 330 facilities</span>
  <span class="pill ink">~ 47 senior living communities</span>
  <span class="pill ink">17 states</span>
  <span class="pill accent">All six are databases + UIs + APIs</span>
</div>

<div class="footnote">
Each connector implements the official SDK. No screen-scraping, no headless-browser puppeteering, no unsanctioned automation.
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- This is the pivot slide. Don't dwell on it; it's the bridge to architecture.
- Emphasize: humans don't disappear. They review, they approve, they govern. They just don't click forms anymore.
- The "1 control plane vs 6 dashboards" line is the headline.
-->

# What changes
## One control plane. Six APIs. Humans approve, not operate.

<div class="grid cols-2">
  <div class="card">
    <div class="label">Before</div>
    <div class="value">6 dashboards · N seats · M tabs</div>
    <div class="body">DON in PCC. Admin in Workday. Compliance in SharePoint. Switch context, lose context.</div>
  </div>
  <div class="card" style="border-color: var(--accent); background: var(--accent-weak);">
    <div class="label" style="color: var(--accent)">After</div>
    <div class="value" style="color: var(--accent)">1 control plane · 1 audit log</div>
    <div class="body">Agents read every system. Humans see one decision queue. Approve in &lt; 10 seconds.</div>
  </div>
</div>

<h3>What humans still do</h3>

- <strong>Approve</strong> state-changing actions on a decision card with full context, evidence, and dollar/days impact
- <strong>Escalate</strong> when an agent's confidence is below threshold or two agents disagree
- <strong>Govern</strong> via policy console — set agent autonomy levels per facility, per domain, per action class
- <strong>Audit</strong> via tamper-evident chain — every read, every write, every prompt, every PHI token

<div class="footnote">
The agent does the click-paths. The human owns the judgment call.
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Architecture slide. The CTO's eyes will go straight to the diagram. Be ready to defend each layer.
- Phase 1 (today): Anthropic Managed Agents under BAA, with PHI tokenization at the gateway.
- Phase 2 (target): Bedrock-Managed-Agents in Ensign VPC. Same SDK, different runtime.
- The HyperFrames clip below shows PHI flow with the tokenization boundary glowing.
-->

# Architecture
## Managed Agents → MCP gateway → connectors → enterprise APIs

<div class="arch">
  <div class="arch-row">
    <div class="layer-label">Reasoning</div>
    <div class="layer-content">
      <span class="pill violet">Anthropic Managed Agents</span>
      <span class="pill ink">claude-sonnet-4 / claude-opus-4</span>
      <span class="pill ink">sdk.beta.sessions · sdk.beta.agents</span>
      <span class="pill ink">version-pinned</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label">Gateway</div>
    <div class="layer-content">
      <span class="pill accent">MCP Proxy</span>
      <span class="pill ink">PHI tokenization</span>
      <span class="pill ink">vault credential injection</span>
      <span class="pill ink">RBAC enforcement</span>
      <span class="pill ink">rate limit + circuit break</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label">Connectors</div>
    <div class="layer-content">
      <span class="pill ink">PCC FHIR</span>
      <span class="pill ink">Workday REST/WQL</span>
      <span class="pill ink">Graph API</span>
      <span class="pill ink">SharePoint</span>
      <span class="pill ink">SQL</span>
      <span class="pill ink">CMS · OIG · SAM</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label">State</div>
    <div class="layer-content">
      <span class="pill ink">Postgres (sessions · decisions)</span>
      <span class="pill ink">Audit chain (advisory-locked)</span>
      <span class="pill ink">Graph DB (entity edges)</span>
      <span class="pill ink">Object store (artifacts)</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label">Plane</div>
    <div class="layer-content">
      <span class="pill ink">Decision queue · HITL</span>
      <span class="pill ink">Policy console</span>
      <span class="pill ink">Inspector · Replay</span>
      <span class="pill ink">Audit verifier</span>
    </div>
  </div>
</div>

<div class="footnote">
SDK: official <code>@anthropic-ai/sdk</code> — never raw HTTP. Sessions stream via <code>sdk.beta.sessions.events.stream()</code>; cursor via <code>after_id</code>.
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- This is THE slide for credibility. Be precise and honest.
- Phase 1 today: Managed Agents at platform.claude.com under signed BAA. PHI is tokenized BEFORE it leaves Ensign's network.
- Phase 2: AWS Bedrock-Managed-Agents in Ensign VPC. PHI never leaves the VPC. Same SDK surface — Anthropic ships it, we redeploy.
- Anthropic offers a HIPAA BAA. AWS Bedrock is BAA-eligible and HITRUST.
- Don't promise "Bedrock today" — the audit caught that as a credibility-killer.
-->

# PHI handling
## Phase 1 today · Phase 2 target

<div class="grid cols-2">
  <div class="card">
    <h3 style="margin-top:0">Phase 1 — Today <span style="font-size:11px;color:var(--ink-3);font-weight:400">· Day 0 to ~120</span></h3>
    <ul>
      <li><strong>Anthropic Managed Agents</strong> under signed BAA</li>
      <li><strong>PHI tokenized at the MCP gateway</strong> — names, MRNs, DOBs, rooms replaced with session-scoped tokens before any prompt is built</li>
      <li>De-id map lives in Ensign-controlled Postgres; tokens UUID-prefixed, session-scoped, no cross-session leakage</li>
      <li>Anthropic sees <code>[NAME_a1b2_0001]</code>, never <em>Margaret Chen</em></li>
    </ul>
  </div>
  <div class="card" style="border-color: var(--accent)">
    <h3 style="margin-top:0;color:var(--accent)">Phase 2 — Target <span style="font-size:11px;color:var(--ink-3);font-weight:400">· Day ~120 onward</span></h3>
    <ul>
      <li><strong>Bedrock-Managed-Agents</strong> in Ensign's AWS VPC</li>
      <li>PHI <strong>never leaves the VPC</strong> — inference colocated with data</li>
      <li>Migration is a runtime swap, not a rewrite — same SDK surface</li>
      <li>Tokenization stays on as defense-in-depth</li>
    </ul>
  </div>
</div>

<video class="motion" src="motion/phi-boundary.mp4" poster="motion/phi-boundary-poster.jpg" autoplay muted loop playsinline preload="auto"></video>

<div class="citations">
HIPAA §164.502(d) de-identification · §164.314(a) BAA requirements · Anthropic Trust Center · AWS Bedrock HIPAA eligibility
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- HITL is the safety story. Every state-changing action is gated.
- Decision card: name, room, dollars, evidence, recommendation, confidence — all on one card. Approve in <10s.
- Reflect the corrected status handling: requires_action is treated as paused, not terminal. session.status_idle is what we resume from.
- Cite §164.312(a)(1) (access controls) — not for HITL specifically, but for the role-checked authorization that gates every approve.
-->

# Human-in-the-loop governance
## Every state-changing action is paused, gated, and logged.

<div class="grid cols-2">
  <div class="card">
    <h3 style="margin-top:0">The flow</h3>
    <ol>
      <li>Agent identifies action requiring approval (Medicare appeal, PCC care plan update, Workday timecard adjustment)</li>
      <li>Session enters <code>requires_action</code> — Aedis treats this as <strong>paused</strong>, not terminal. Cursor preserved via <code>after_id</code>.</li>
      <li>Decision card materializes: full context, evidence, recommendation, confidence score, dollar/days impact</li>
      <li>Human approves (Enter), escalates (E), or defers (D). Single keystroke. RBAC checked.</li>
      <li>SDK receives <code>user.tool_confirmation</code>. Session resumes from <code>session.status_idle</code>.</li>
      <li>Audit row written, hash chain extended, downstream agents notified via event cascade</li>
    </ol>
  </div>
  <div class="card">
    <h3 style="margin-top:0">Decision card</h3>
    <div class="stack">
      <div><span class="pill red">CRITICAL</span> <span class="pill ink">Bayview · Rm 247</span> <span class="pill ink">$8,420</span></div>
      <div style="font-size:16px;font-weight:600;color:var(--ink-1);margin-top:6px;letter-spacing:-0.005em">Submit Medicare A appeal — Margaret Chen denial</div>
      <div style="font-size:13px;color:var(--ink-3);line-height:1.45">CMS reason 5J: insufficient skilled-need documentation. Appeal window closes in 11 days. PT notes 11/12, 11/14, 11/15 support skilled need; agent confidence 94%.</div>
      <div class="row" style="margin-top:4px">
        <span class="pill green">approve · ⏎</span>
        <span class="pill amber">escalate · E</span>
        <span class="pill ink">defer · D</span>
      </div>
    </div>
  </div>
</div>

<div class="citations">
HIPAA §164.312(a)(1) access control · §164.308(a)(4) information access management · NIST SP 800-53 AC-3 · AC-6 least privilege
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Audit chain is the compliance backbone. Describe the INTENDED schema (the bug fix is in flight in parallel).
- Key properties:
  - sequence_number BIGINT GENERATED ALWAYS AS IDENTITY — gives total monotonic order
  - previous_hash + content_hash — Merkle-style chain. Tamper any row, the chain breaks.
  - advisory lock on (tenant_id) during writes — serializes inserts so sequence_numbers can't interleave
- Cite §164.312(b) audit controls + §164.312(c)(1) integrity.
-->

# Audit chain
## Tamper-evident, monotonically ordered, advisory-locked.

<div class="grid cols-2">
  <div class="card">
    <h3 style="margin-top:0">Schema (intended)</h3>
<pre><code>CREATE TABLE audit_event (
  sequence_number  BIGINT GENERATED ALWAYS AS IDENTITY,
  tenant_id        UUID         NOT NULL,
  occurred_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  actor_type       TEXT         NOT NULL,   -- 'agent'|'human'|'system'
  actor_id         TEXT         NOT NULL,
  event_type       TEXT         NOT NULL,
  resource_ref     TEXT,                    -- e.g. 'pcc:resident:12345'
  payload          JSONB        NOT NULL,
  previous_hash    BYTEA        NOT NULL,
  content_hash     BYTEA        NOT NULL,
  PRIMARY KEY (sequence_number)
);</code></pre>
  </div>
  <div class="card">
    <h3 style="margin-top:0">Write protocol</h3>
    <ol>
      <li>Acquire pg advisory lock on <code>hashtext(tenant_id)</code> — serializes writes per tenant</li>
      <li>Read tail content_hash; compute <code>content_hash = sha256(prev || canonical(row))</code></li>
      <li>Insert; identity column assigns <code>sequence_number</code> atomically</li>
      <li>Release lock; publish to event bus</li>
    </ol>
    <h3>Verifier</h3>
    <ul>
      <li>Walk chain head-to-tail, recompute each <code>content_hash</code></li>
      <li>Mismatch → tamper alert, page on-call, freeze tenant</li>
      <li>Daily attestation; verifier signature persisted</li>
    </ul>
  </div>
</div>

<div class="citations">
HIPAA §164.312(b) audit controls · §164.312(c)(1) integrity · 21 CFR Part 11 §11.10(e) audit trails · NIST SP 800-66r2 audit
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Identity & RBAC. They will care about: who can do what, can we kill it, how do we onboard.
- Azure Entra ID JWKS (RS256) is the standard. RBAC is enforced at the API layer AND at the MCP proxy.
- Per-facility scope: a DON at Bayview can't see Heritage Oaks data. JWT carries facility claim.
- Kill switches: pause/resume per agent, per facility, or globally. <30s to take effect.
-->

# Identity & RBAC
## Azure Entra ID, per-facility scope, kill switches.

<div class="grid cols-2">
  <div class="card">
    <h3 style="margin-top:0">Authentication</h3>
    <ul>
      <li><strong>Azure Entra ID JWKS</strong> (RS256) · 6-hour key cache · auto-rotate on verify failure</li>
      <li><code>JWT_SECRET</code> HS256 fallback service-to-service only — never exposed to humans</li>
      <li>Dev fallback removed; WebSocket upgrades require <code>?token=</code> query param</li>
      <li>Audience: <code>aedis://ensign</code> · Issuer: Ensign's Entra tenant</li>
    </ul>
  </div>
  <div class="card">
    <h3 style="margin-top:0">Authorization</h3>
    <ul>
      <li>5 base roles: <strong>CEO · Admin · DON · Billing · Accounting</strong>. Extensible.</li>
      <li>JWT claims: <code>roles[]</code>, <code>facility_ids[]</code>, <code>scope[]</code>. Connector calls scoped per facility.</li>
      <li>Read-only / auditor users <strong>cannot</strong> hit escalate, defer, or trigger endpoints</li>
      <li>Decision approvals require role match — checked server-side, not by the UI</li>
    </ul>
  </div>
</div>

<div class="grid cols-3" style="margin-top:6px">
  <div class="card">
    <div class="label">Pause one agent</div>
    <div class="value" style="font-size:16px">&lt; 30 seconds</div>
    <div class="body">In-flight sessions transition to <code>paused</code>; queue stops draining.</div>
  </div>
  <div class="card">
    <div class="label">Pause facility</div>
    <div class="value" style="font-size:16px">&lt; 30 seconds</div>
    <div class="body">Per-facility scope freezes all agent activity for that <code>facility_id</code>.</div>
  </div>
  <div class="card">
    <div class="label">Global kill</div>
    <div class="value" style="font-size:16px">&lt; 30 seconds</div>
    <div class="body">Tenant-level pause; sessions drain to checkpoint.</div>
  </div>
</div>

<div class="citations">
HIPAA §164.308(a)(4) access management · §164.312(a)(1) access control · §164.312(a)(2)(iii) automatic logoff · NIST SP 800-63B AAL2
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Vault & proxy. THE answer to "what if the agent leaks credentials".
- Agents NEVER see raw secrets. Ever. The MCP proxy injects them at request time and strips them from any logs/traces.
- AWS Secrets Manager holds Ensign credentials. Path: snf/{tenant}/{credential}.
- 90-day rotation via Lambda + dual-key pattern (overlap window so no ops break).
- Emergency revoke: < 15 min. Wipe the secret, rotate, reissue. Lambda + CloudWatch alarm + on-call page.
-->

# Vault-and-proxy
## Agents never see raw credentials. Ever.

<div class="grid cols-2">
  <div class="card">
    <h3 style="margin-top:0">Storage & rotation</h3>
    <ul>
      <li><strong>AWS Secrets Manager</strong> at <code>snf/{tenant}/{credential}</code></li>
      <li>Per-credential KMS key, customer-managed</li>
      <li><strong>90-day automated rotation</strong> via Lambda — dual-key overlap so ops never break</li>
      <li>CloudWatch alarms on rotation failure; on-call paged</li>
      <li>Production refuses env-based secrets; <code>--source=env</code> is dev only</li>
    </ul>
  </div>
  <div class="card">
    <h3 style="margin-top:0">Request flow</h3>
    <ol>
      <li>Agent calls MCP tool with <strong>no</strong> credential field</li>
      <li>Proxy authenticates JWT (RS256), looks up tenant + credential</li>
      <li>Proxy fetches secret (cached 5min, KMS-decrypted) and makes upstream call</li>
      <li>Response returned to agent — credential never crosses the agent boundary</li>
      <li>Audit row written — secret never logged or echoed</li>
    </ol>
  </div>
</div>

<h3 style="margin-top:8px">Emergency revocation</h3>

<div class="row">
  <span class="pill red">Detect</span>
  <span class="pill ink">CloudWatch alarm · manual trigger · Sentry</span>
  <span class="pill amber">Revoke</span>
  <span class="pill ink">emergency-revoke.ts · scrubs Secrets Manager · invalidates cache</span>
  <span class="pill green">Reissue</span>
  <span class="pill ink">Terraform reprovision · &lt; 15 min end-to-end</span>
</div>

<div class="citations">
HIPAA §164.312(a)(2)(i) unique user ID · §164.308(a)(5)(ii)(D) password mgmt · NIST SP 800-57 key mgmt · NIST SP 800-53 IA-5
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Compliance posture. Be honest about what's signed, what's in flight.
- BAAs: Anthropic (signed), AWS (template ready, awaiting Ensign exec). Vendor BAAs flow through their standard programs.
- SOC 2 Type 1 by Day 90 — auditor selected, controls scoped, evidence collection automated.
- HITRUST is a roadmap, not a current claim. Type 2 follows after a 6-12 month observation window.
-->

# Compliance posture
## What's signed, what's in flight, what's roadmap.

<table>
<thead>
<tr><th>Item</th><th>Status</th><th>ETA</th><th>Notes</th></tr>
</thead>
<tbody>
<tr><td>HIPAA BAA — Anthropic</td><td><span class="pill green">Signed</span></td><td>Today</td><td>Covers Phase 1 Managed Agents. Available on request.</td></tr>
<tr><td>HIPAA BAA — AWS</td><td><span class="pill amber">Template ready</span></td><td>Day 0</td><td>Standard AWS BAA, executed during Phase 2 VPC provisioning.</td></tr>
<tr><td>HIPAA BAA — Aedis ↔ Ensign</td><td><span class="pill amber">Drafted</span></td><td>Day 0</td><td>To execute at engagement kickoff. Reviewed by HIPAA counsel.</td></tr>
<tr><td>SOC 2 Type 1</td><td><span class="pill amber">In flight</span></td><td>Day 90</td><td>Auditor selected, controls scoped, evidence pipeline live.</td></tr>
<tr><td>SOC 2 Type 2</td><td><span class="pill ink">Roadmap</span></td><td>Day 365</td><td>Requires 6–12 month observation window post-Type 1.</td></tr>
<tr><td>HITRUST CSF r2</td><td><span class="pill ink">Roadmap</span></td><td>Year 2</td><td>Path mapped, prerequisites in SOC 2 controls.</td></tr>
<tr><td>NIST SP 800-66r2</td><td><span class="pill green">Aligned</span></td><td>Today</td><td>Risk assessment & controls mapped to HIPAA Security Rule.</td></tr>
<tr><td>Privacy Policy / ToS</td><td><span class="pill green">Published</span></td><td>Today</td><td>aedis.health (target) · current at goforit5.github.io/Aedis</td></tr>
</tbody>
</table>

<div class="citations">
HIPAA Security Rule §164.306–§164.318 · HHS audit protocol · AICPA TSC 2017 · HITRUST CSF v11
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Engagement model. Be direct. Barry has $4B revenue and pays SaaS millions/year — this is a rounding error for him.
- Day 0–30: I'm in. PCC, Workday, M365 wired. One pilot facility live with HITL gates. Barry's team observes.
- Day 30+: scale with 5-6 AI engineers. Domain by domain.
- Exclusivity: 6-month nationwide for SNF, in exchange for first-mover access. After that we open up.
-->

# Engagement model
## 30-day wire-up · scale on signal · 6-month nationwide exclusivity.

<div class="grid cols-2">
  <div class="card">
    <h3 style="margin-top:0">Day 0 — 30 · me, hands on</h3>
    <ul>
      <li>Stand up MCP gateway in dev VPC</li>
      <li>Wire <strong>PCC</strong> (FHIR + REST) — residents, vitals, care plans, MAR</li>
      <li>Wire <strong>Workday</strong> (REST + WQL) — workers, time, GL, benefits</li>
      <li>Wire <strong>M365</strong> (Graph) — mail, calendar, SharePoint policies</li>
      <li>Deploy 1 pilot facility with HITL gates and 6 starter agents</li>
      <li>Daily demo · weekly architecture review</li>
    </ul>
  </div>
  <div class="card">
    <h3 style="margin-top:0">Day 30 — 180 · small team scales it</h3>
    <ul>
      <li>Add <strong>5–6 senior AI engineers</strong> (frontend, backend, infra, ML)</li>
      <li>Domain by domain: Clinical → Finance → Workforce → Quality → Operations</li>
      <li>Phase 2 migration to Bedrock-Managed-Agents in Ensign VPC</li>
      <li>Roll out 10 → 50 → 330 facilities on telemetry-driven cadence</li>
      <li>SOC 2 Type 1 audit complete by Day 90</li>
    </ul>
  </div>
</div>

<div class="card" style="border-color: var(--accent); background: var(--accent-weak); margin-top:6px">
  <div class="label" style="color: var(--accent)">Exclusivity</div>
  <div class="value" style="color: var(--accent); font-size:16px">6 months nationwide SNF exclusivity</div>
  <div class="body">In exchange for engagement signing + credential handoff. After window, market opens — Ensign keeps a permanent preferred-pricing tier and roadmap influence.</div>
</div>

<div class="footnote">
The ask is not "approve this in committee for six months." It's "sign an LOI this week, hand over credentials, watch us wire it."
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Five concrete asks. Don't soften them. The CTO wants a clear list, not a pitch.
- Each one has a doc/playbook. Reference the credential-registration packet.
- After this slide, the conversation is logistical, not philosophical.
-->

# What we need from Ensign
## Five decisions. Five days to deploy.

<table>
<thead>
<tr><th>#</th><th>What</th><th>Owner</th><th>Doc</th></tr>
</thead>
<tbody>
<tr><td>1</td><td><strong>PCC OAuth client</strong> — client ID + secret, redirect URI, scopes. We need read on residents, vitals, care plans, MAR; write on care plan updates and progress notes (gated by HITL).</td><td>Ensign IT + PCC vendor</td><td><code>platform/docs/credential-registration/pcc-registration.md</code></td></tr>
<tr><td>2</td><td><strong>Workday tenant</strong> — tenant URL, OAuth client, integration system user (ISU). Read on workers, time, GL; write on timecard adjustments (HITL gated).</td><td>Ensign HRIS</td><td><code>workday-registration.md</code></td></tr>
<tr><td>3</td><td><strong>M365 Azure AD app registration</strong> — client ID + cert, Graph permissions: Mail.Read, Calendars.ReadWrite, Sites.Read.All, Files.Read.All. Tenant admin consent.</td><td>Ensign Azure admin</td><td><code>m365-registration.md</code> · Terraform module ready</td></tr>
<tr><td>4</td><td><strong>AWS account access</strong> — sandbox account for Phase 1, production VPC subnet for Phase 2 Bedrock deployment. We supply CloudFormation; you control the account.</td><td>Ensign Cloud Ops</td><td>Phase 2 only — Day ~90</td></tr>
<tr><td>5</td><td><strong>BAAs executed</strong> — Aedis ↔ Ensign, AWS ↔ Ensign (Phase 2). Anthropic BAA already covers Phase 1 via Aedis.</td><td>Ensign Legal</td><td>Drafts shared with engagement letter</td></tr>
</tbody>
</table>

<div class="footnote">
With these five in hand, the wire-up is a matter of days, not months. No ABMS approvals, no committee tour — just a handoff and a working pilot.
</div>

---

<!-- _class: qa -->
<!--
Speaker notes:
- Q&A. Open the floor.
- Don't run from hard questions. Honest answer > confident BS.
- If they ask "what if Anthropic goes down" — circuit breakers, fallback to read-only, kill switch, audit chain stays consistent.
- If they ask "can we self-host the model" — yes, Phase 2 is exactly that (Bedrock in their VPC).
- If they ask "what's the team size" — 1 (me) for 30 days, 5-6 after.
- Close: "I'd rather wire one connector live than answer ten more slides. Want to do PCC right now?"
-->

# Questions.

<div class="meta" style="margin-top:32px">
<strong>Andrew Pearson</strong> · andrew@taskvisory.com<br/>
Demo (current): <span class="pill ink">goforit5.github.io/Aedis</span><br/>
Demo (target post-DNS): <span class="pill ink">aedis.health</span><br/>
Repo: <span class="pill ink">goforit5/Aedis</span> (private) · CTO pack: <span class="pill ink">goforit5/aedis-pitch-deck</span> (private)
</div>
