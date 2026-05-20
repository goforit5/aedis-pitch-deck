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
- Phase 1 today: Managed Agents at platform.claude.com under signed BAA. PHI is tokenized at the MCP boundary BEFORE prompts cross the boundary.
- Phase 2: AWS Bedrock-Managed-Agents in Ensign VPC. PHI never leaves the VPC. Same SDK surface — Anthropic ships it, we redeploy.
- IMPORTANT correction vs. earlier framing: OCR/vision lives INSIDE the HIPAA boundary (Zone 2). The agent only ever sees tokenized output. See "6 Trust Zones" slides next.
- Anthropic offers a HIPAA BAA. AWS Bedrock is BAA-eligible.
- Language: we do NOT claim HIPAA de-identification. We use tokenization as an operational privacy control.
-->

# PHI handling
## Phase 1 today · Phase 2 target · tokenized by default

<div class="grid cols-2">
  <div class="card">
    <h3 style="margin-top:0">Phase 1 — Today <span style="font-size:11px;color:var(--ink-3);font-weight:400">· Day 0 to ~120</span></h3>
    <ul>
      <li><strong>Anthropic Managed Agents</strong> under signed BAA</li>
      <li><strong>OCR and vision run inside the HIPAA boundary</strong> (Zone 2); only tokenized output crosses to the agent</li>
      <li><strong>Tokenized at the MCP gateway</strong> — names, MRNs, DOBs, rooms replaced with tenant-scoped HMAC tokens before any prompt is built</li>
      <li>Token vault lives in Ensign-controlled Postgres; tokens are session-scoped, tenant-scoped, key-versioned, no cross-session leakage</li>
      <li>Anthropic sees <code>resident_tok_7J4K9Q</code>, never <em>Margaret Chen</em></li>
    </ul>
  </div>
  <div class="card" style="border-color: var(--accent)">
    <h3 style="margin-top:0;color:var(--accent)">Phase 2 — Target <span style="font-size:11px;color:var(--ink-3);font-weight:400">· Day ~120 onward</span></h3>
    <ul>
      <li><strong>Bedrock-Managed-Agents</strong> in Ensign's AWS VPC</li>
      <li>PHI <strong>never leaves the VPC</strong> — inference colocated with data</li>
      <li>Migration is a runtime swap, not a rewrite — same SDK surface</li>
      <li>Tokenization stays on as defense-in-depth (privacy-preserving by default)</li>
    </ul>
  </div>
</div>

<video class="motion" src="motion/phi-boundary.mp4" poster="motion/phi-boundary-poster.jpg" autoplay muted loop playsinline preload="auto"></video>

<div class="citations">
HIPAA §164.502(b) minimum necessary · §164.314(a) BAA requirements · §164.312(e)(1) transmission security · Anthropic Trust Center · AWS Bedrock HIPAA eligibility
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Overview of the 6 trust zones. Set up the next 4 slides.
- Lead with: "the agent literally cannot see Margaret Chen's name even by mistake — here's the boundary that makes that true."
- Each zone has a different trust posture, a different actor set, and a different audit policy.
- Zones 1-2 are the HIPAA boundary. Zones 3-4 are tokenized-only. Zone 5 is the agent's reality. Zone 6 is the human's reality.
-->

# 6 Trust Zones
## Where data lives, who can read it, what crosses the line

<div class="arch">
  <div class="arch-row">
    <div class="layer-label" style="color:var(--red)">Zone 1</div>
    <div class="layer-content">
      <span class="pill red">Raw PHI Vault</span>
      <span class="pill ink">scanned PDFs · DICOM · faxed orders · raw HL7/CDA</span>
      <span class="pill ink">readers: vault service only</span>
      <span class="pill ink">KMS CMK · VPC endpoint · no agent access</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label" style="color:var(--amber)">Zone 2</div>
    <div class="layer-content">
      <span class="pill amber">HIPAA OCR / Vision</span>
      <span class="pill ink">AWS Textract · Bedrock vision (in-VPC)</span>
      <span class="pill ink">readers: ocr-service identity only</span>
      <span class="pill ink">no prompt logging with raw PHI</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label" style="color:var(--violet)">Zone 3</div>
    <div class="layer-content">
      <span class="pill violet">Token Vault</span>
      <span class="pill ink">resident_tok ↔ raw_mrn map · HMAC(tenant, facility, src, mrn)</span>
      <span class="pill ink">readers: rehydration service · break-glass auditor</span>
      <span class="pill ink">key-versioned · TTL 24h · rotated on session close</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label" style="color:var(--violet)">Zone 4</div>
    <div class="layer-content">
      <span class="pill violet">Tokenized Doc Store</span>
      <span class="pill ink">OCR text + layout · tables · forms · confidence — PHI replaced with tokens</span>
      <span class="pill ink">readers: any agent or human under RBAC</span>
      <span class="pill ink">no raw names · no raw MRNs · no DOBs</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label" style="color:var(--green)">Zone 5</div>
    <div class="layer-content">
      <span class="pill green">Agent Workspace</span>
      <span class="pill ink">Managed Agents · Bedrock agents</span>
      <span class="pill ink">readers: agent (tokenized-only) · server-enforced tool allowlist</span>
      <span class="pill ink">prompts and tool calls cited in audit chain</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label" style="color:var(--accent)">Zone 6</div>
    <div class="layer-content">
      <span class="pill accent">Rehydration + Audit Replay</span>
      <span class="pill ink">tokens → cleartext for authorized humans only</span>
      <span class="pill ink">readers: human under RBAC + purpose-of-use + MFA</span>
      <span class="pill ink">every rehydration logged · replayable per decision</span>
    </div>
  </div>
</div>

<div class="footnote">
Zones 1–2 are the HIPAA boundary (raw PHI lives here, agents never enter). Zones 3–5 are tokenized-only. Zone 6 is where authorized humans see cleartext under audit.
</div>

<div class="citations">
HIPAA §164.502(b) minimum necessary · §164.308(a)(4) information access management · NIST SP 800-53 AC-3 · AC-6 least privilege · SC-28 protection at rest
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- THE correction slide. The earlier Aedis story implied "tokenize → then AI." Wrong.
- PHI is trapped in pixels until OCR runs. So OCR must run INSIDE the HIPAA boundary, not outside it.
- Textract + Bedrock vision execute in-VPC under BAA. Output: structured tokens + redacted layout.
- The agent gets the tokenized output, not the original document.
- The agent literally cannot see Margaret Chen's name even if it asked — there is no tool path.
-->

# Why OCR lives inside the PHI boundary
## PHI is trapped in pixels until OCR runs

<div class="grid cols-2">
  <div class="card" style="border-color: var(--red)">
    <h3 style="margin-top:0;color:var(--red)">The naive design (wrong)</h3>
    <ol>
      <li>Upload scanned admission packet to S3</li>
      <li>Hand the PDF to an LLM and "ask it to tokenize"</li>
      <li>Trust the model to redact</li>
    </ol>
    <p style="font-size:13px;color:var(--ink-3);margin:8px 0 0"><strong>Failure mode:</strong> the LLM has already <em>read</em> the PHI to redact it. PHI has crossed the boundary. There is no undo.</p>
  </div>
  <div class="card" style="border-color: var(--green)">
    <h3 style="margin-top:0;color:var(--green)">Aedis design (Zone 2)</h3>
    <ol>
      <li>Raw doc lands in Zone 1 vault — encrypted at rest, no agent reachable</li>
      <li><strong>Inside the HIPAA boundary</strong>, ocr-service calls AWS Textract (BAA-covered) for structured text + layout + tables + forms + confidence</li>
      <li>Where confidence is low or vision is required (handwriting, signatures, stamps), <strong>Bedrock vision runs in the same VPC</strong> — no prompt logging that includes PHI</li>
      <li>PHI scanner sweeps the OCR output, tokenizes detected entities, writes to Zone 4</li>
      <li>Only the tokenized output (Zone 4) is visible to agents in Zone 5</li>
    </ol>
  </div>
</div>

<div class="row" style="margin-top:16px">
  <span class="pill ink">Textract (BAA)</span>
  <span class="pill ink">Bedrock vision (in-VPC)</span>
  <span class="pill ink">PHI scanner: NAME · MRN · DOB · ADDR · PHONE · EMAIL · SSN · ACCT</span>
  <span class="pill green">Agent prompt contains zero raw PHI</span>
</div>

<div class="citations">
HIPAA §164.312(a)(1) access control · §164.312(b) audit controls · §164.312(c)(1) integrity · AWS Textract HIPAA eligibility · Bedrock HIPAA eligibility
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- The compliance language slide. Read this one slowly. Be precise.
- We do NOT claim HIPAA de-identification (Safe Harbor or Expert Determination). Those are formal processes we have not pursued.
- We DO claim tokenization as an operational privacy control. It is defensible, auditable, and least-privilege.
- Tokens are tenant-scoped HMACs — not plain hashes — so they cannot be brute-forced across tenants.
- This slide is the answer to "how is this different from de-id" — it's not de-id, it's a different control with a different posture.
-->

# Tokenization, not de-identification
## Precise compliance language

<div class="grid cols-2">
  <div class="card" style="border-color: var(--red)">
    <h3 style="margin-top:0;color:var(--red)">We do NOT claim</h3>
    <ul>
      <li>HIPAA Safe Harbor de-identification under §164.514(b)(2)</li>
      <li>Expert Determination de-identification under §164.514(b)(1)</li>
      <li>"Bulletproof", "HIPAA-certified", or any superlative</li>
      <li>That tokenized data is outside the HIPAA Privacy Rule scope</li>
    </ul>
  </div>
  <div class="card" style="border-color: var(--green)">
    <h3 style="margin-top:0;color:var(--green)">We DO claim</h3>
    <ul>
      <li><strong>Tokenization as an operational privacy control</strong> — least-privilege, BAA-covered, auditable</li>
      <li><strong>Tenant-scoped HMAC tokens</strong> — <code>HMAC_SHA256(tenant_secret, facility_id + source_system + raw_mrn)</code></li>
      <li>Tokens are not reversible without rehydration service access (Zone 3 break-glass)</li>
      <li>Every rehydration is logged with actor, purpose-of-use, MFA factor, and decision context</li>
    </ul>
  </div>
</div>

<div class="card" style="margin-top:14px;border-color: var(--ink-4);background: var(--bg-sunk)">
  <p style="margin:0;font-size:14px;color:var(--ink-2);line-height:1.5">
    <strong>For the record:</strong> "We do not claim de-identification under HIPAA. We use tokenization as our operational privacy control. De-identification is a separate compliance determination we have not pursued."
  </p>
</div>

<div class="citations">
HIPAA §164.514(a)–(b) de-identification standards · §164.502(d) de-identification permitted uses · NIST SP 800-188 de-identification guidance · OCR FAQ on de-identification
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Two modes. Default is Mode A — tokenized text, cheap, fast, safe. 95%+ of decisions.
- Mode B — PHI-bound vision — escalates only when (a) confidence < threshold, (b) vision required (signature, stamp, handwriting), (c) human reviewer asks for the raw doc.
- Mode B runs in-VPC. No prompt logging that includes PHI. Output is still tokenized before it returns to the agent.
- The audience question: "how do you decide which mode?" → next slide (confidence routing).
-->

# Two AI modes
## Tokenized-text by default · PHI-bound vision on escalation

<div class="grid cols-2">
  <div class="card" style="border-color: var(--green)">
    <h3 style="margin-top:0;color:var(--green)">Mode A — Tokenized-text agent (default)</h3>
    <ul>
      <li>Runs in Zone 5 (Anthropic Managed Agents under BAA in Phase 1; Bedrock in-VPC in Phase 2)</li>
      <li>Input: tokenized OCR output from Zone 4 — zero raw PHI</li>
      <li>Output: tokenized decision proposal with cited evidence tokens</li>
      <li>Use cases: AP coding, invoice reconciliation, claim appeal drafting, schedule analysis, policy lookup</li>
      <li><strong>~95% of decisions resolve here</strong></li>
    </ul>
  </div>
  <div class="card" style="border-color: var(--amber)">
    <h3 style="margin-top:0;color:var(--amber)">Mode B — PHI-bound vision agent (escalation)</h3>
    <ul>
      <li>Runs <strong>inside the HIPAA boundary</strong> (Bedrock vision in-VPC under BAA)</li>
      <li>Input: raw document pixels from Zone 1 (signature blocks, handwriting, stamps, complex layouts)</li>
      <li>No prompt logging that includes PHI · output tokenized before return to Zone 5</li>
      <li>Use cases: signature verification, handwritten progress notes, ID badge OCR fallback, complex form vision</li>
      <li><strong>Escalation only · always dual-approval HITL · governance level 5</strong></li>
    </ul>
  </div>
</div>

<div class="footnote">
The agent doesn't choose its mode. The confidence router does — see next slide.
</div>

<div class="citations">
HIPAA §164.312(a)(1) access control · §164.312(b) audit controls · §164.502(b) minimum necessary · Bedrock HIPAA eligibility · Anthropic BAA
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Confidence routing. The CTO will care about: "how do you decide which path?"
- Green: deterministic auto. Textract confidence > 0.95, schema validates, no PHI ambiguity → tokenized agent, single-approval HITL.
- Yellow: tokenized LLM normalizer. Textract 0.80–0.95, schema partial, ambiguous entity. Mode A normalizes, still HITL.
- Red: Bedrock vision escalation. Textract < 0.80, signature/handwriting required, human asks for raw view. Mode B, dual-approval HITL.
- This is the same routing pattern as the existing decision queue green/amber/red — but for the data path, not just the action.
-->

# Confidence routing
## Green deterministic · Yellow tokenized LLM · Red PHI-bound vision

<div class="grid cols-3">
  <div class="card" style="border-color: var(--green)">
    <h3 style="margin-top:0;color:var(--green)">Green — deterministic</h3>
    <p style="font-size:13px;color:var(--ink-3);margin:0 0 8px"><code>textract.confidence &gt; 0.95</code> · schema validates · no PHI ambiguity</p>
    <ul>
      <li>Auto-tokenize, hand to Mode A</li>
      <li>Single-approval HITL · governance level 4</li>
      <li>Audit row written, downstream agents notified</li>
    </ul>
  </div>
  <div class="card" style="border-color: var(--amber)">
    <h3 style="margin-top:0;color:var(--amber)">Yellow — tokenized LLM</h3>
    <p style="font-size:13px;color:var(--ink-3);margin:0 0 8px"><code>0.80 ≤ confidence ≤ 0.95</code> · schema partial · ambiguous entities</p>
    <ul>
      <li>Mode A normalizer (tokenized text only)</li>
      <li>Single-approval HITL with normalizer trace</li>
      <li>If normalizer fails twice → escalate to red</li>
    </ul>
  </div>
  <div class="card" style="border-color: var(--red)">
    <h3 style="margin-top:0;color:var(--red)">Red — PHI-bound vision</h3>
    <p style="font-size:13px;color:var(--ink-3);margin:0 0 8px"><code>confidence &lt; 0.80</code> · signature / handwriting / human request</p>
    <ul>
      <li>Mode B vision (in-VPC, no PHI logging)</li>
      <li>Dual-approval HITL · governance level 5</li>
      <li>Auditor co-signs · full chain replayable</li>
    </ul>
  </div>
</div>

<div class="footnote">
The router itself is deterministic and inspectable in the audit chain. No model decides whether PHI escapes the boundary — policy does.
</div>

<div class="citations">
HIPAA §164.312(a)(1) access control · §164.308(a)(4) information access management · NIST SP 800-53 AC-3 · §164.312(b) audit controls
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Live demo moment 1 of 3. Cue to flip from raw to tokenized in the running app.
- The tokenized-view toggle is in the ControlBar top-right (shield icon, role="switch", aria-checked).
- The decision recommendation text is IDENTICAL between modes — proving the agent never saw the name to begin with.
-->

# Live demo · Patient Safety toggle
## Margaret Chen → resident_tok_7J4K9Q

<div class="grid cols-2">
  <div class="card">
    <h3 style="margin-top:0">What the human sees</h3>
    <div class="stack">
      <div><span class="pill amber">PHI · cleartext</span></div>
      <div style="font-size:15px;font-weight:600;color:var(--ink-1)">Margaret Chen · Bayview · Rm 247</div>
      <div style="font-size:13px;color:var(--ink-3);line-height:1.45">MRN 18477392 · DOB 1948-03-14 · POA Susan Chen</div>
    </div>
  </div>
  <div class="card" style="border-color: var(--green)">
    <h3 style="margin-top:0;color:var(--green)">What the agent sees</h3>
    <div class="stack">
      <div><span class="pill green">tokenized</span></div>
      <div style="font-size:15px;font-weight:600;color:var(--ink-1)"><code>resident_tok_7J4K9Q</code> · <code>facility_tok_BV</code> · <code>room_tok_247</code></div>
      <div style="font-size:13px;color:var(--ink-3);line-height:1.45"><code>mrn_tok_B8Z1P2</code> · <code>dob_tok_3FD9A1</code> · <code>poa_tok_44KQ8L</code></div>
    </div>
  </div>
</div>

<div class="footnote">
The decision recommendation reads identically in both modes. The agent's prompt contained zero raw PHI to begin with — the toggle just changes what the human reviewer sees.
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Live demo moment 2 of 3. Audit Replay swimlane for D-4822.
- Six zones, one decision, one chain. Shows every actor, every payload hash, every tool call, every egress.
- Audience sees: raw doc landed in Zone 1 (hash only, no readable content), OCR detected NAME:2, MRN:1, DOB:1, tokens created, agent prompt visible (no names in it), tools called from the allowlist, human approval event, redacted Workday payload egress.
-->

# Live demo · Audit Replay
## 6-zone swimlane for Decision D-4822

<div class="arch">
  <div class="arch-row">
    <div class="layer-label" style="color:var(--red)">Zone 1</div>
    <div class="layer-content">
      <span class="pill red">raw_doc.received</span>
      <span class="pill ink">actor: vault-service</span>
      <span class="pill ink">sha256: 9a7c…b2e1</span>
      <span class="pill ink">size: 312 KB · pages: 4</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label" style="color:var(--amber)">Zone 2</div>
    <div class="layer-content">
      <span class="pill amber">ocr.extracted</span>
      <span class="pill ink">actor: ocr-service</span>
      <span class="pill ink">phi_entities: {NAME:2, MRN:1, DOB:1}</span>
      <span class="pill ink">policy: tokpol_2026_05</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label" style="color:var(--violet)">Zone 3</div>
    <div class="layer-content">
      <span class="pill violet">tokens.created</span>
      <span class="pill ink">resident_tok_7J4K9Q · mrn_tok_B8Z1P2 · dob_tok_3FD9A1</span>
      <span class="pill ink">key_version: v3</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label" style="color:var(--violet)">Zone 4</div>
    <div class="layer-content">
      <span class="pill violet">tokenized_doc.stored</span>
      <span class="pill ink">doc_id: tdoc_4F2A · contains zero raw PHI</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label" style="color:var(--green)">Zone 5</div>
    <div class="layer-content">
      <span class="pill green">agent.prompt_built</span>
      <span class="pill ink">agent: ClinicalMonitor-v12</span>
      <span class="pill ink">prompt_sha256: 4c1d…8a92</span>
      <span class="pill ink">tools_called: search_tokenized_invoices, propose_appeal_draft</span>
    </div>
  </div>
  <div class="arch-row">
    <div class="layer-label" style="color:var(--accent)">Zone 6</div>
    <div class="layer-content">
      <span class="pill accent">human.rehydrated</span>
      <span class="pill ink">actor: don-bayview · MFA: webauthn</span>
      <span class="pill ink">purpose: appeal_review · minimum_necessary: true</span>
      <span class="pill ink">egress: workday.expense_create (tokenized)</span>
    </div>
  </div>
</div>

<div class="footnote">
Every row above is a real audit event with a content hash linking to the previous row. The chain is monotonically ordered, advisory-locked per tenant, and verifier-replayable end-to-end.
</div>

---

<!-- _class: content -->
<!--
Speaker notes:
- Live demo moment 3 of 3. Agent Inspector Tool Permissions tab.
- This is the "the agent has no tool that can leak PHI even if it tried" proof.
- Allowed: search_tokenized_invoices, compare_invoice_to_contract, propose_gl_code, request_rehydration_for_human_review.
- Forbidden: display_mrn, display_patient_name, read_phi_vault, decrypt_raw_document. Server-enforced, not UI-enforced.
-->

# Live demo · Agent Inspector — Tool Permissions
## The agent has no tool that can leak PHI

<div class="grid cols-2">
  <div class="card" style="border-color: var(--green)">
    <h3 style="margin-top:0;color:var(--green)">Allowed tools (Clinical Monitor)</h3>
    <ul>
      <li><code>search_tokenized_invoices</code></li>
      <li><code>compare_invoice_to_contract</code></li>
      <li><code>propose_gl_code</code></li>
      <li><code>request_rehydration_for_human_review</code></li>
      <li><code>draft_appeal_letter</code> (tokenized output)</li>
    </ul>
  </div>
  <div class="card" style="border-color: var(--red)">
    <h3 style="margin-top:0;color:var(--red)">Forbidden tools (server-enforced)</h3>
    <ul style="list-style:none;padding-left:0">
      <li><span style="text-decoration:line-through;color:var(--red)"><code>display_mrn</code></span></li>
      <li><span style="text-decoration:line-through;color:var(--red)"><code>display_patient_name</code></span></li>
      <li><span style="text-decoration:line-through;color:var(--red)"><code>read_phi_vault</code></span></li>
      <li><span style="text-decoration:line-through;color:var(--red)"><code>decrypt_raw_document</code></span></li>
      <li><span style="text-decoration:line-through;color:var(--red)"><code>egress_to_unscoped_endpoint</code></span></li>
    </ul>
  </div>
</div>

<div class="footnote">
Enforcement lives in the MCP gateway, not the agent. The agent literally has no path to the forbidden tools — they are not registered in its session manifest.
</div>

<div class="citations">
HIPAA §164.308(a)(4) information access management · §164.312(a)(1) access control · NIST SP 800-53 AC-6 least privilege · AC-3 access enforcement
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
<tr><td>Token lifecycle policy</td><td><span class="pill green">Codified</span></td><td>Today</td><td>Session-scoped · 24h TTL · tenant-HMAC derivation · KMS key versioning · rotated on session close</td></tr>
<tr><td>Role-based evidence visibility</td><td><span class="pill green">Codified</span></td><td>Today</td><td>Agents see tokens always · humans see per RBAC + purpose-of-use + MFA · both paths audited</td></tr>
</tbody>
</table>

<div class="citations">
HIPAA Security Rule §164.306–§164.318 · HHS audit protocol · AICPA TSC 2017 · NIST SP 800-66r2
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
