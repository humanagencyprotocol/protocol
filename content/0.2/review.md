---
title: "v0.3 Review"
version: "Draft"
date: "January 2026"
status: "Proposal"
---

# Human Agency Protocol — v0.3 Proposal

## Multi-Domain Ownership & Role-Scoped Disclosure

**Status:** Draft / Under Review
**Goal:** Ensure the *right* humans decide, with domain-appropriate information, without breaking privacy or auditability.

---

## 1. Motivation

### What v0.2 guarantees

- A human decided
- Gates were closed
- Ownership exists
- Disclosure was reviewed (single hash)

### What v0.2 does not guarantee

- The *right* humans decided (domain accountability)
- Each owner reviewed *relevant* information (not everything, not nothing)
- Independent auditability per domain

### The gap

An engineer approving a marketing-impacting change without marketing involvement is a governance failure that v0.2 permits. v0.3 closes this gap by:

1. Making domain requirements explicit per execution path
2. Ensuring each domain sees only relevant information
3. Binding each domain's attestation to what they actually reviewed

---

## 2. Core Principle

> Profiles define what authority exists.
> Developers propose which authority is needed.
> Domain owners validate and accept that proposal.

---

## 3. Profile Extensions

v0.3 extends the Profile with one new section and modifies execution paths.

### 3.1 Execution Paths with Required Domains

Required domains are defined per execution path — not through conditions.

```json
{
  "executionPaths": {
    "deploy-prod-canary": {
      "description": "Canary deployment (limited rollout)",
      "requiredDomains": ["engineering"]
    },
    "deploy-prod-full": {
      "description": "Full deployment (immediate rollout)",
      "requiredDomains": ["engineering", "release_management"]
    },
    "deploy-prod-user-facing": {
      "description": "User-facing feature deployment",
      "requiredDomains": ["engineering", "marketing"]
    },
    "deploy-prod-security": {
      "description": "Security-sensitive deployment",
      "requiredDomains": ["engineering", "security"]
    }
  }
}
```

**Normative rules:**

1. Each execution path explicitly lists its required domains.
2. The person selecting the execution path commits to that governance level.
3. Choosing a less restrictive path for a change that warrants more oversight is auditable misbehavior.
4. No conditions, no magic — explicit human choice of governance scope.

### 3.2 Domain Disclosure Schema

Defines what each domain owner must be shown to validly close their gate.

```json
{
  "disclosureSchema": {
    "domains": {
      "engineering": {
        "required_fields": ["diff_summary", "changed_paths", "test_status", "rollback_strategy"]
      },
      "marketing": {
        "required_fields": ["behavior_change_summary", "demo_url", "rollout_plan"]
      },
      "security": {
        "required_fields": ["affected_surfaces", "threat_category", "mitigation_path"]
      },
      "release_management": {
        "required_fields": ["deployment_window", "rollback_plan", "monitoring_dashboards"]
      }
    }
  }
}
```

**Normative rules:**

1. Local App MUST NOT allow gate closure unless all required fields for that domain are present.
2. Each domain sees only its required fields — not other domains' disclosures.
3. No semantic content leaves local custody.

---

## 4. Decision File

### 4.1 Developer Proposal in Commit

The developer proposing a change creates a `.hap/decision.json` file in the commit. This file contains:

1. **Execution path** — the proposed governance level
2. **Disclosure** — all information each required domain needs to review

```json
{
  "profile": "deploy-gate@0.3",
  "execution_path": "deploy-prod-full",
  "disclosure": {
    "engineering": {
      "diff_summary": "Refactored auth flow to use JWT tokens",
      "changed_paths": ["src/api/auth.ts", "src/ui/login.tsx"],
      "test_status": "All 142 tests passing",
      "rollback_strategy": "Revert commit or disable via feature flag"
    },
    "marketing": {
      "behavior_change_summary": "Login button moved to header, new SSO option visible",
      "demo_url": "https://preview-abc123.example.com",
      "rollout_plan": "10% canary for 24h, then full rollout"
    },
    "release_management": {
      "deployment_window": "Tuesday 10am-2pm UTC",
      "rollback_plan": "Revert via GitHub, ~5 min to restore",
      "monitoring_dashboards": "https://grafana.example.com/auth-service"
    }
  }
}
```

### 4.2 Why in the Commit?

**Immutable** — The decision file is part of the commit SHA. It cannot be changed without creating a new commit.

**Verifiable** — Anyone can read the file and verify what was proposed. Domain owners see the exact proposal in the PR diff.

**Accountable** — The developer who creates the commit is accountable for:
- Choosing the appropriate execution path
- Providing accurate disclosure information for each domain

### 4.3 Proposal Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. DEVELOPER creates commit with .hap/decision.json                    │
│     • Proposes execution path (e.g., deploy-prod-full)                  │
│     • Provides disclosure for each required domain                      │
│     • Opens PR                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  2. DOMAIN OWNERS review the proposal                                   │
│     • See execution path and their domain's disclosure in PR diff       │
│     • Validate: Is this the right governance level?                     │
│     • Validate: Is the disclosure accurate and complete?                │
│     • If they agree → attest                                            │
│     • If they disagree → don't attest, request changes                  │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  3. ALL REQUIRED DOMAINS attest to the same frame                       │
│     • Frame derived from commit (includes decision.json via SHA)        │
│     • All attestations share same frame_hash                            │
│     • Each attestation includes domain-specific disclosure_hash         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.4 Disagreement Handling

If a domain owner disagrees with the proposal:

1. **Wrong execution path** — "This change is user-facing, should be `deploy-prod-user-facing` not `deploy-prod-canary`"
   - Domain owner refuses to attest
   - Developer must amend: new commit with corrected path
   - New SHA, new frame, new attestation cycle

2. **Incomplete disclosure** — "Missing rollback strategy"
   - Domain owner refuses to attest
   - Developer must amend: new commit with complete disclosure
   - New SHA, new frame, new attestation cycle

3. **Inaccurate disclosure** — "Test status says passing but CI shows failures"
   - Domain owner refuses to attest
   - Developer must fix tests and update disclosure
   - New SHA, new frame, new attestation cycle

**No one can unilaterally override** — All required domains must attest to the same frame.

---

## 5. Frame Changes

### 5.1 Frame Derivation

The frame is derived from the commit and deployment context:

```
repo     ← from git (e.g., owner/repo)
sha      ← from git (includes .hap/decision.json content)
env      ← from deployment context (staging, prod)
profile  ← from .hap/decision.json
path     ← from .hap/decision.json
```

**v0.3 Frame structure:**

```
repo=owner/repo
sha=abc123def456...
env=prod
profile=deploy-gate@0.3
path=deploy-prod-user-facing
```

The `profile` and `path` are read from `.hap/decision.json` but verified via the SHA — if the file changes, the SHA changes, creating a new frame.

### 5.2 Remove `disclosure_hash` from Frame

**Rationale:** If the frame contains a single combined disclosure_hash, individual domain owners cannot independently prove what they reviewed without access to all domains' disclosures. This breaks domain-scoped auditability.

Disclosure binding moves to the attestation (per-domain).

### 5.3 No Condition Fields

v0.3 does **not** add condition fields to the frame.

**Rationale:** Self-declared conditions (e.g., "is this security-relevant?") are meaningless — the person who might want to skip oversight decides whether oversight is required. This is circular.

Instead, required domains are determined by **execution path** in `.hap/decision.json` — an explicit developer proposal validated by domain owners.

---

## 6. Attestation Changes

### 6.1 Per-Domain Disclosure Binding

Each attestation includes the disclosure hash for the domain(s) it covers.

```json
{
  "attestation_id": "uuid",
  "version": "0.3",
  "profile_id": "deploy-gate@0.3",
  "frame_hash": "sha256:...",
  "resolved_domains": [
    {
      "domain": "engineering",
      "did": "did:key:...",
      "env": "prod",
      "disclosure_hash": "sha256:..."
    }
  ],
  "issued_at": 1735888000,
  "expires_at": 1735891600
}
```

**Normative rules:**

1. For every domain this attestation covers, include: `domain`, `did`, `env`, `disclosure_hash`.
2. The `disclosure_hash` is computed from the domain-specific disclosure view.
3. One attestation typically covers one domain (one person, one scope).
4. Multi-domain decisions require multiple attestations from different owners.

### 6.2 Auditability Guarantee

Each domain owner can independently prove:

- "I attested to frame X" → `frame_hash` in attestation
- "I reviewed Y before attesting" → domain's `disclosure_hash`
- Without needing any other domain's disclosure

---

## 7. Executor Proxy Flow

### 7.1 Execution Request

The client submits an execution request with all required attestations:

```json
{
  "action": {
    "template_id": "deploy-prod-v1",
    "params": {
      "repo": "owner/repo",
      "sha": "abc123...",
      "env": "prod",
      "profile_id": "deploy-gate@0.3",
      "execution_path": "deploy-prod-user-facing"
    }
  },
  "attestations": [
    "base64-attestation-blob-engineering...",
    "base64-attestation-blob-marketing..."
  ]
}
```

### 7.2 Validation Steps

Executor Proxy performs:

1. **Reconstruct frame** from action params
2. **Compute frame_hash**
3. **Fetch Profile** for `deploy-gate@0.3`
4. **Look up execution path** → get `requiredDomains`
5. **For each required domain:**
   - Find attestation covering that domain
   - Fetch SP public key (cached or on-demand)
   - Verify signature
   - Verify `frame_hash` matches
   - Verify TTL not expired
   - Verify scope is sufficient (`domain` + `env`)
6. **If any required domain missing or invalid** → reject with structured error
7. **If all valid** → authorize execution

### 7.3 SP Consultation

The Executor Proxy consults the Service Provider only to fetch the public key for signature verification:

```
GET /api/sp/pubkey → { "public_key": "hex..." }
```

All validation logic runs locally. The SP is not a runtime dependency for validation — only for key retrieval (which can be cached).

### 7.4 Stateless Design

The Executor Proxy:

- Does not store attestations
- Does not query attestation registries
- Receives all proof in the request
- Validates and decides

Where attestations are stored (PR comments, database, registry) is an integration concern, not a protocol concern.

---

## 8. Disclosure View Generation

### 8.1 Source: Decision File in Commit

The disclosure lives in `.hap/decision.json` within the commit:

```json
{
  "profile": "deploy-gate@0.3",
  "execution_path": "deploy-prod-user-facing",
  "disclosure": {
    "engineering": {
      "diff_summary": "Refactored auth flow to use JWT",
      "changed_paths": ["src/api/auth.ts", "src/ui/login.tsx"],
      "test_status": "All 142 tests passing",
      "rollback_strategy": "Revert commit"
    },
    "marketing": {
      "behavior_change_summary": "Login button moved to header",
      "demo_url": "https://preview-abc123.example.com",
      "rollout_plan": "10% canary, then full"
    }
  }
}
```

The Local App reads this file from the commit to display domain-specific views.

### 8.2 Domain View Extraction

The Local App extracts domain-specific views for each domain owner:

```typescript
function extractDomainView(decision: DecisionFile, domain: string): DomainView {
  return decision.disclosure[domain];
}
```

Each domain owner sees **only their domain's disclosure** — not other domains' information.

### 8.3 Domain Disclosure Hash

Each domain's `disclosure_hash` is computed from its view:

```typescript
const engineeringView = decision.disclosure.engineering;
const engineeringDisclosureHash = sha256(canonicalize(engineeringView));
```

This ensures:

- Engineering's hash only covers engineering-relevant content
- Marketing's hash only covers marketing-relevant content
- Neither can see or verify the other's disclosure
- Each domain owner can independently prove what they reviewed

---

## 9. Error Codes

New error codes for v0.3:

| Code | Description |
|------|-------------|
| `MISSING_REQUIRED_DOMAIN` | A required domain has no valid attestation |
| `DOMAIN_SCOPE_MISMATCH` | Attestation domain/env doesn't match requirement |
| `DISCLOSURE_SCHEMA_VIOLATION` | Domain disclosure missing required fields |
| `DECISION_FILE_MISSING` | Commit does not contain .hap/decision.json |
| `DECISION_FILE_INVALID` | Decision file malformed or missing required fields |

---

## 10. Backward Compatibility

### What changes

- Frame no longer includes `disclosure_hash`
- Attestations include `resolved_domains` with per-domain `disclosure_hash`
- Execution paths explicitly define `requiredDomains`
- Execution path and disclosure now in `.hap/decision.json` in commit

### Migration path

- v0.2 attestations remain valid for v0.2 profiles
- v0.3 profiles require v0.3 attestations
- Executor Proxy checks `version` field and applies appropriate validation
- v0.3 requires `.hap/decision.json` in commit

---

## 11. Demo Implementation Plan

### Step 1: Update Profile with execution paths

Update Profile with paths that require different domains:

- `deploy-prod-canary` → engineering only
- `deploy-prod-full` → engineering + release_management
- `deploy-prod-user-facing` → engineering + marketing

### Step 2: Read decision file from commit

Update Local App to:

1. Fetch `.hap/decision.json` from the commit via GitHub API
2. Parse execution path and disclosure
3. Validate against profile schema (all required fields present)
4. Display error if decision file missing or invalid

### Step 3: Update Gate 1 (Frame) UI

Gate 1 now reads from the decision file instead of user input:

- Load PR → fetch `.hap/decision.json` from commit
- Display proposed execution path (read-only)
- Show: "This path requires: Engineering, Marketing"
- Domain owner validates the proposal

### Step 4: Split disclosure UI by domain

Each domain owner sees only their domain's disclosure from the decision file:

- Engineering sees: diff_summary, changed_paths, test_status, rollback_strategy
- Marketing sees: behavior_change_summary, demo_url, rollout_plan
- No cross-domain visibility

### Step 5: Generate per-domain disclosure hashes

When attesting:

1. Extract domain view from decision file
2. Compute domain-specific `disclosure_hash`
3. Include in attestation's `resolved_domains`

### Step 6: Update Executor Proxy validation

Verify:

1. Fetch `.hap/decision.json` from commit
2. Look up `requiredDomains` from execution path
3. All required domains have attestations
4. Each attestation has valid signature, TTL, frame_hash
5. Each attestation includes `disclosure_hash` for its domain

### Step 7: Update GitHub Action

Check:

- `.hap/decision.json` exists in commit
- Required domains determined by execution path in decision file
- All required domain attestations exist
- All signatures and TTLs valid
- All frame_hashes match current SHA

---

## 12. Summary

| Aspect | v0.2 | v0.3 |
|--------|------|------|
| Execution path selection | First attestor chooses | Developer proposes in commit |
| Disclosure source | Entered in UI | In commit (`.hap/decision.json`) |
| Disclosure hash | Single, in frame | Per-domain, in attestation |
| Domain-specific views | Not enforced | Schema-enforced |
| Condition evaluation | N/A | None (explicit path choice) |
| Auditability | "Someone approved" | "Right person approved after seeing right info" |
| Accountability | First attestor | Developer proposes, domains validate |

---

## 13. Design Decisions

### Why proposal in commit?

If the first attestor chooses the execution path:

- They have disproportionate power over governance level
- Other domain owners must follow or refuse entirely
- No clear accountability for path selection

With proposal in commit:

- Developer explicitly declares governance scope
- All domain owners validate the same proposal
- Clear accountability: developer proposes, domains validate
- Immutable: proposal is part of the SHA

### Why all disclosure in commit?

Dynamic disclosure (fetched from CI, previews, etc.) creates problems:

- Disclosure can change between attestation and audit
- Harder to verify what was actually reviewed
- External dependencies for validation

With disclosure in commit:

- Fully immutable and verifiable
- Developer accountable for accurate disclosure
- No external dependencies for validation
- Domain owners can verify disclosure in PR diff

### Why no conditional domains?

Self-declared conditions (e.g., `security_relevant: true/false`) are meaningless:

- The person who might want to skip oversight decides whether oversight is required
- This is circular and easily gamed

Instead, governance scope is determined by **execution path** in the decision file:

- Explicit developer proposal
- Validated by domain owners
- Clear accountability for choosing the wrong path

### Why per-domain disclosure hashes?

With a single disclosure hash:

- Domain owners cannot independently prove what they reviewed
- Auditing requires reconstructing the full disclosure (which domains shouldn't see)

With per-domain hashes:

- Each owner can prove: "I attested to frame X after reviewing disclosure Y"
- No cross-domain disclosure exposure
- Full auditability without privacy violation

---

## 14. Gate Content Verifiability

### 14.1 Problem

The protocol requires human articulation at gates 3-5 (Problem, Objective, Tradeoffs). But if that content is never hashed or published, the requirement is unenforceable after the fact. The attestation says "I decided" but not "here's what I considered."

### 14.2 Principle

> The protocol guarantees verifiability, not publication.
> The decision to publish is the owner's.

Gate content is private by default. But if the owner chooses to publish, anyone can verify it is the authentic content that was attested to.

### 14.3 Gate Content Hashes in Attestation

At attestation time, the content of each gate is hashed and included in the attestation:

```json
{
  "attestation_id": "uuid",
  "version": "0.3",
  "profile_id": "deploy-gate@0.3",
  "frame_hash": "sha256:...",
  "resolved_domains": [
    {
      "domain": "engineering",
      "did": "did:key:...",
      "env": "prod",
      "disclosure_hash": "sha256:..."
    }
  ],
  "gate_content_hashes": {
    "problem": "sha256:...",
    "objective": "sha256:...",
    "tradeoffs": "sha256:..."
  },
  "issued_at": 1735888000,
  "expires_at": 1735891600
}
```

This happens automatically at attestation time. The owner does not need to opt in — the hashes are always computed and included.

### 14.4 Publication is Optional

After attestation, the owner may choose to publish the actual gate content:

- As a PR comment
- In a decision log
- In an internal wiki or audit trail
- Not at all

The protocol does not require publication. The hashes in the attestation are sufficient to prove that content existed and was committed to.

### 14.5 Verification Flow

If gate content is published, anyone can verify it:

1. Hash the published content for each gate
2. Compare against `gate_content_hashes` in the attestation
3. Match = verified authentic content
4. Mismatch = content was tampered with after attestation

### 14.6 Properties

| Property | Guarantee |
|----------|-----------|
| **Private by default** | Gate content stays with the owner unless they choose to share |
| **Verifiable on demand** | If published, hashes prove authenticity |
| **Tamper-evident** | Cannot publish different content than what was hashed |
| **Non-repudiable** | Owner cannot deny what they wrote — the hash is in their signed attestation |

### 14.7 Normative Rules

1. The Local App MUST compute `gate_content_hashes` at attestation time.
2. The hash for each gate MUST be computed from the exact text the owner entered.
3. `gate_content_hashes` MUST be included in the signed attestation payload.
4. The protocol MUST NOT require publication of gate content.
5. If gate content is published, verifiers MUST be able to independently compute the hash and compare.

---

## 15. AI Constraints & Gate Resolution

### 15.1 Drop In-Protocol AI Assistant

v0.3 removes the entire in-protocol AI assistant subsystem. The protocol enforces accountability, not thought purity. Users will consult external AI regardless — restricting in-protocol AI creates friction without preventing the behavior.

**Removed:**

- AI provider integrations (Ollama, OpenAI, Groq, Together)
- AI-driven alignment checking on gate closure
- AI-generated questions and follow-ups
- AI warning acknowledgment in commitment gate
- All `gate/*` SDGs (entry and follow-up questions)

### 15.2 Enforceable Constraints

The protocol enforces only what it can guarantee:

1. **No prefill / no autogenerate** — The protocol MUST NOT populate gate fields. Text enters through human action only (typing, speaking, or pasting).
2. **Gates close through human action** — A human must explicitly close each gate.
3. **Gate resolution = presence only** — A gate closes when its field is non-empty. The protocol does not evaluate adequacy, quality, completeness, or correctness.

### 15.3 Gate Questions in Profile

Predefined gate questions move from SDGs to the Profile:

```json
{
  "gateQuestions": {
    "problem": { "question": "What problem are you solving?", "required": true },
    "objective": { "question": "What outcome do you want?", "required": true },
    "tradeoffs": { "question": "What are you willing to sacrifice?", "required": true }
  }
}
```

Questions are used as textarea placeholders — guidance, not enforcement.

### 15.4 Simplified SDGs

SDGs are reduced to structural checks only:

- `deploy/missing_decision_owner@1.0` — Hard stop
- `deploy/commitment_mismatch@1.0` — Hard stop
- `deploy/tradeoff_execution_mismatch@1.0` — Hard stop
- `deploy/objective_diff_mismatch@1.0` — Warning only

No SDG evaluates free-form text for correctness. Semantic rules (`always`, `semantic_mismatch`) are removed.

See [v0.3 AI Constraints Proposal](/doc/v0.3-ai-constraints.md) for full details.

---

## 16. Open Questions

1. **Domain inheritance** — Can a domain "include" another domain's required fields?

2. **Attestation aggregation** — Should there be a way to combine multiple domain attestations into one signed bundle?

3. **Decision file validation** — Should the Local App validate the decision file against a JSON schema before allowing attestation?

---

## 17. Next Steps

1. Review this proposal
2. Implement in demo (deploy-gate profile)
3. Validate with real multi-domain scenario
4. Finalize for v0.3 specification
