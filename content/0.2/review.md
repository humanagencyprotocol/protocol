---
title: "v0.3 Review"
version: "Draft"
date: "January 2026"
status: "Proposal"
---

# Human Agency Protocol — v0.3 Proposal

## Multi-Domain Ownership & Execution Context Binding

**Status:** Draft / Under Review
**Goal:** Ensure the *right* humans commit, to domain-specific execution constraints, without breaking privacy or auditability.

---

## 1. Motivation

### What v0.2 guarantees

- A human committed
- Gates were closed
- Ownership exists
- Execution context was committed to (single hash)

### What v0.2 does not guarantee

- The *right* humans committed (domain accountability)
- Each owner committed to *relevant* execution constraints (scoped, not global)
- Independent auditability per domain

### The gap

An engineer approving a marketing-impacting change without marketing involvement is a governance failure that v0.2 permits. v0.3 closes this gap by:

1. Making domain requirements explicit per execution path
2. Scoping execution constraints per domain
3. Binding each domain's attestation to the constraints they committed to

---

## 2. Core Principle

> Profiles define what authority exists.
> Developers propose which authority is needed.
> Domain owners validate and accept that proposal.

---

## 3. Protocol Scope

### 3.1 What the Protocol Verifies

The protocol verifies:

- A human committed (cryptographic signature)
- To a specific action (frame hash)
- Under specific constraints (execution context hash)
- At a specific time (SP timestamp)
- With declared authority (domain ownership)

### 3.2 What the Protocol Does NOT Verify

The protocol does NOT verify:

- Understanding
- Informed consent
- Quality of reasoning
- Whether the human read anything
- Whether AI contributed to the decision

**The protocol verifies commitment, not comprehension.**

### 3.3 Execution Context, Not Disclosure

Execution context represents the structured constraints binding an executor. It is NOT:

- Evidence of understanding
- Proof of review quality
- Record of what was "seen"
- Informed consent documentation

Any semantic content used to reach a decision (AI analysis, deliberation, reasoning) remains local and out of protocol scope.

### 3.4 Terminology: Action vs. Execution

The protocol uses two related but distinct terms:

| Term | Meaning | Examples |
|------|---------|----------|
| **Action** | WHAT is being authorized | `action template`, `action params` |
| **Execution** | HOW it is carried out, under what constraints | `execution path`, `execution context` |

**Action** is the thing being authorized — deploy SHA X to environment Y. It defines the intent.

**Execution** is the carrying out of that action under specific constraints — which governance path, what domains must approve, what context each domain commits to.

The Executor Proxy receives an **action** (what to do) and validates that proper **execution** constraints were met (who committed, under what context).

### 3.5 Protocol vs. Profile Layering

The protocol defines abstract concepts. Profiles define concrete implementations.

| Layer | Defines | Example |
|-------|---------|---------|
| **Protocol** | Decision record structure, frame binding, attestation format | "A decision record must be immutably bound to the action" |
| **Profile** | How binding works in a specific context | "For GitHub PRs, the decision record is `.hap/decision.json` in the commit" |

**Why this matters:**

HAP governs any context where humans authorize actions:

- Code deployment (git repositories)
- Document approval (markdown files, wikis)
- Infrastructure changes (Terraform, Ansible)
- AI agent workflows (human attests to bounds, agent executes within)
- Policy decisions
- Contract signing

The protocol must remain abstract. Context-specific bindings belong in profiles.

---

## 4. Profile Extensions

v0.3 extends the Profile with one new section and modifies execution paths.

### 4.1 Execution Paths with Required Domains

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

### 4.2 Domain Execution Context Schema

Defines the execution constraints each domain owner commits to.

```json
{
  "executionContextSchema": {
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

1. Local App MUST NOT allow gate closure unless all required execution context fields for that domain are present.
2. Each domain commits only to its execution context — not other domains' constraints.
3. No semantic content leaves local custody.

---

## 5. Decision Record

### 5.1 Definition

A **decision record** is a structured document that captures:

1. **Profile** — which profile governs this decision
2. **Execution path** — the proposed governance level
3. **Execution context** — structured constraints each domain commits to

```json
{
  "profile": "deploy-gate@0.3",
  "execution_path": "deploy-prod-full",
  "execution_context": {
    "engineering": {
      "diff_summary": "Refactored auth flow to use JWT tokens",
      "test_status": "All 142 tests passing",
      "rollback_strategy": "Revert or disable via feature flag"
    },
    "marketing": {
      "behavior_change_summary": "Login button moved to header",
      "rollout_plan": "10% canary, then full rollout"
    }
  }
}
```

### 5.2 Binding Requirements

The decision record MUST be:

**Immutable** — Once created, it cannot be changed. Modifications require a new decision record.

**Bound to action** — The decision record must be cryptographically bound to the action being authorized. How this binding works is profile-specific.

**Verifiable** — Anyone with appropriate access can verify what execution constraints were proposed.

### 5.3 Proposal Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. PROPOSER creates decision record                                    │
│     • Proposes execution path (governance level)                        │
│     • Defines execution context for each required domain                │
│     • Binds to action (profile-specific mechanism)                      │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  2. DOMAIN OWNERS review the proposal                                   │
│     • See execution path and their domain's constraints                 │
│     • Validate: Is this the right governance level?                     │
│     • Validate: Are the execution constraints accurate?                 │
│     • If they agree → attest                                            │
│     • If they disagree → don't attest, request changes                  │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  3. ALL REQUIRED DOMAINS attest to the same frame                       │
│     • Frame derived from action + decision record                       │
│     • All attestations share same frame_hash                            │
│     • Each attestation includes domain-specific execution_context_hash  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Disagreement Handling

If a domain owner disagrees with the proposal:

1. **Wrong execution path** — Domain owner refuses to attest. Proposer must create new decision record with corrected path. New frame, new attestation cycle.

2. **Incomplete execution context** — Domain owner refuses to attest. Proposer must create new decision record with complete constraints.

3. **Inaccurate execution context** — Domain owner refuses to attest. Proposer must fix the issue and create new decision record.

**No one can unilaterally override** — All required domains must attest to the same frame.

---

## 6. Frame Changes

### 6.1 Frame Derivation

A frame uniquely identifies an action and its decision record. The frame contains:

| Field | Source |
|-------|--------|
| `action_id` | Profile-specific action identifier |
| `profile` | From decision record |
| `path` | From decision record |
| `env` | From action context (optional) |

**v0.3 Frame structure (abstract):**

```
action_id=<profile-specific identifier>
profile=<profile-id>
path=<execution-path>
env=<environment>
```

The frame MUST be deterministically derivable from the action and decision record. If the decision record changes, the frame changes.

### 6.2 Remove `execution_context_hash` from Frame

**Rationale:** If the frame contains a single combined execution_context_hash, individual domain owners cannot independently prove what constraints they committed to without access to all domains' contexts. This breaks domain-scoped auditability.

Execution context binding moves to the attestation (per-domain).

### 6.3 No Condition Fields

v0.3 does **not** add condition fields to the frame.

**Rationale:** Self-declared conditions (e.g., "is this security-relevant?") are meaningless — the person who might want to skip oversight decides whether oversight is required. This is circular.

Instead, required domains are determined by **execution path** in the decision record — an explicit proposal validated by domain owners.

---

## 7. Attestation Changes

### 7.1 Per-Domain Execution Context Binding

Each attestation includes the execution context hash for the domain(s) it covers.

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
      "execution_context_hash": "sha256:..."
    }
  ],
  "issued_at": 1735888000,
  "expires_at": 1735891600
}
```

**Normative rules:**

1. For every domain this attestation covers, include: `domain`, `did`, `env`, `execution_context_hash`.
2. The `execution_context_hash` is computed from the domain-specific execution context.
3. One attestation typically covers one domain (one person, one scope).
4. Multi-domain decisions require multiple attestations from different owners.

### 7.2 Auditability Guarantee

Each domain owner can independently prove:

- "I attested to frame X" → `frame_hash` in attestation
- "I committed to constraints Y" → domain's `execution_context_hash`
- Without needing any other domain's execution context

---

## 8. Executor Proxy Flow

### 8.1 Execution Request

The client submits an execution request with all required attestations:

```json
{
  "action": {
    "template_id": "<profile-specific-template>",
    "params": {
      "action_id": "<profile-specific-identifier>",
      "env": "prod",
      "profile_id": "deploy-gate@0.3",
      "execution_path": "deploy-prod-user-facing"
    }
  },
  "attestations": [
    "base64-attestation-blob-domain-1...",
    "base64-attestation-blob-domain-2..."
  ]
}
```

The `action_id` and `template_id` are profile-specific. For git-based profiles, these might be repository and SHA. For other contexts, they might be document IDs, request IDs, or other identifiers.

### 8.2 Validation Steps

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

### 8.3 SP Consultation

The Executor Proxy consults the Service Provider only to fetch the public key for signature verification:

```
GET /api/sp/pubkey → { "public_key": "hex..." }
```

All validation logic runs locally. The SP is not a runtime dependency for validation — only for key retrieval (which can be cached).

### 8.4 Stateless Design

The Executor Proxy:

- Does not store attestations
- Does not query attestation registries
- Receives all proof in the request
- Validates and decides

Where attestations are stored (PR comments, database, registry) is an integration concern, not a protocol concern.

---

## 9. Execution Context Generation

### 9.1 Source: Decision Record

The execution context lives in the decision record. How the decision record is stored and retrieved is profile-specific.

```json
{
  "profile": "deploy-gate@0.3",
  "execution_path": "deploy-prod-user-facing",
  "execution_context": {
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

The Local App reads the decision record to display domain-specific contexts.

### 9.2 Domain Context Extraction

The Local App extracts domain-specific contexts for each domain owner:

```typescript
function extractDomainContext(decision: DecisionRecord, domain: string): DomainContext {
  return decision.execution_context[domain];
}
```

Each domain owner commits to **only their domain's execution context** — not other domains' constraints.

### 9.3 Domain Execution Context Hash

Each domain's `execution_context_hash` is computed from its context:

```typescript
const engineeringContext = decision.execution_context.engineering;
const engineeringContextHash = sha256(canonicalize(engineeringContext));
```

This ensures:

- Engineering's hash only covers engineering-relevant constraints
- Marketing's hash only covers marketing-relevant constraints
- Neither can see or verify the other's context
- Each domain owner can independently prove what constraints they committed to

---

## 10. Error Codes

New error codes for v0.3:

| Code | Description |
|------|-------------|
| `MISSING_REQUIRED_DOMAIN` | A required domain has no valid attestation |
| `DOMAIN_SCOPE_MISMATCH` | Attestation domain/env doesn't match requirement |
| `EXECUTION_CONTEXT_VIOLATION` | Domain execution context missing required fields |
| `DECISION_RECORD_MISSING` | Action has no bound decision record |
| `DECISION_RECORD_INVALID` | Decision record malformed or missing required fields |

---

## 11. Backward Compatibility

### What changes

- Frame no longer includes `execution_context_hash`
- Attestations include `resolved_domains` with per-domain `execution_context_hash`
- Execution paths explicitly define `requiredDomains`
- Execution path and execution context now in decision record (binding is profile-specific)

### Migration path

- v0.2 attestations remain valid for v0.2 profiles
- v0.3 profiles require v0.3 attestations
- Executor Proxy checks `version` field and applies appropriate validation
- v0.3 requires decision record bound to action

---

## 12. Deploy-Gate Profile Binding

This section defines how the deploy-gate profile binds abstract protocol concepts to git-based workflows.

### 12.1 Decision Record Binding

For deploy-gate, the decision record is stored as `.hap/decision.json` in the commit:

- **Location:** `.hap/decision.json` in repository root
- **Binding:** Included in commit SHA (immutable)
- **Retrieval:** Via git or GitHub API

### 12.2 Frame Binding

For deploy-gate, the frame maps to git concepts:

| Abstract | Deploy-Gate Binding |
|----------|---------------------|
| `action_id` | `repo` + `sha` |
| `profile` | From `.hap/decision.json` |
| `path` | From `.hap/decision.json` |
| `env` | From deployment context |

Frame structure:
```
repo=owner/repo
sha=abc123def456...
env=prod
profile=deploy-gate@0.3
path=deploy-prod-user-facing
```

### 12.3 Demo Implementation Steps

**Step 1: Update Profile with execution paths**

- `deploy-prod-canary` → engineering only
- `deploy-prod-full` → engineering + release_management
- `deploy-prod-user-facing` → engineering + marketing

**Step 2: Read decision record from commit**

1. Fetch `.hap/decision.json` from commit via GitHub API
2. Parse execution path and execution context
3. Validate against profile schema
4. Display error if missing or invalid

**Step 3: Update Gate 1 (Frame) UI**

- Load PR → fetch `.hap/decision.json` from commit
- Display proposed execution path (read-only)
- Show: "This path requires: Engineering, Marketing"

**Step 4: Split execution context UI by domain**

- Engineering sees: diff_summary, changed_paths, test_status, rollback_strategy
- Marketing sees: behavior_change_summary, demo_url, rollout_plan
- No cross-domain visibility

**Step 5: Generate per-domain execution context hashes**

1. Extract domain context from decision record
2. Compute domain-specific `execution_context_hash`
3. Include in attestation's `resolved_domains`

**Step 6: Update Executor Proxy validation**

1. Fetch `.hap/decision.json` from commit
2. Look up `requiredDomains` from execution path
3. Verify all required domain attestations exist and are valid

**Step 7: Update GitHub Action**

- Verify `.hap/decision.json` exists
- Verify all required domain attestations exist
- Verify all signatures, TTLs, and frame_hashes

---

## 13. Summary

| Aspect | v0.2 | v0.3 |
|--------|------|------|
| Execution path selection | First attestor chooses | Proposer declares in decision record |
| Execution context source | Entered in UI | In decision record (binding is profile-specific) |
| Execution context hash | Single, in frame | Per-domain, in attestation |
| Domain-specific constraints | Not enforced | Schema-enforced |
| Condition evaluation | N/A | None (explicit path choice) |
| Auditability | "Someone approved" | "Right person committed to scoped constraints" |
| Accountability | First attestor | Proposer declares, domains validate |

---

## 14. Design Decisions

### Why proposer declares in decision record?

If the first attestor chooses the execution path:

- They have disproportionate power over governance level
- Other domain owners must follow or refuse entirely
- No clear accountability for path selection

With proposer declaration:

- Proposer explicitly declares governance scope
- All domain owners validate the same proposal
- Clear accountability: proposer declares, domains validate
- Immutable binding to action

### Why execution context in decision record?

Dynamic execution context (fetched at runtime) creates problems:

- Constraints can change between attestation and execution
- Harder to verify what was actually committed to
- External dependencies for validation

With execution context in decision record:

- Fully immutable and verifiable
- Proposer accountable for accurate constraint definition
- No external dependencies for validation
- Executor can trust the committed constraints

### Why no conditional domains?

Self-declared conditions (e.g., `security_relevant: true/false`) are meaningless:

- The person who might want to skip oversight decides whether oversight is required
- This is circular and easily gamed

Instead, governance scope is determined by **execution path** in the decision record:

- Explicit proposer declaration
- Validated by domain owners
- Clear accountability for choosing the wrong path

### Why per-domain execution context hashes?

With a single execution context hash:

- Domain owners cannot independently prove what constraints they committed to
- Auditing requires reconstructing the full context (which domains shouldn't see)

With per-domain hashes:

- Each owner can prove: "I attested to frame X with constraints Y"
- No cross-domain context exposure
- Full auditability without privacy violation

---

## 15. Gate Content Verifiability

### 15.1 Problem

The protocol requires human articulation at gates 3-5 (Problem, Objective, Tradeoffs). But if that content is never hashed or published, the requirement is unenforceable after the fact. The attestation says "I committed" but not "here's what I committed to."

### 15.2 Principle

> The protocol guarantees verifiability, not publication.
> The decision to publish is the owner's.

Gate content is private by default. But if the owner chooses to publish, anyone can verify it is the authentic content that was attested to.

### 15.3 Gate Content Is Commitment, Not Comprehension

Gate content (problem, objective, tradeoffs) represents what the human committed to articulating. It does NOT prove:

- They understood the implications
- They thought carefully
- They wrote it themselves (vs. AI-assisted)
- The content is correct or complete

The protocol hashes what was committed. Publication makes that commitment visible. Neither guarantees quality of thought.

### 15.4 Gate Content Hashes in Attestation

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
      "execution_context_hash": "sha256:..."
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

### 15.5 Publication is Optional

After attestation, the owner may choose to publish the actual gate content:

- As a PR comment
- In a decision log
- In an internal wiki or audit trail
- Not at all

The protocol does not require publication. The hashes in the attestation are sufficient to prove that content existed and was committed to.

### 15.6 Verification Flow

If gate content is published, anyone can verify it:

1. Hash the published content for each gate
2. Compare against `gate_content_hashes` in the attestation
3. Match = verified authentic content
4. Mismatch = content was tampered with after attestation

### 15.7 Properties

| Property | Guarantee |
|----------|-----------|
| **Private by default** | Gate content stays with the owner unless they choose to share |
| **Verifiable on demand** | If published, hashes prove authenticity |
| **Tamper-evident** | Cannot publish different content than what was hashed |
| **Non-repudiable** | Owner cannot deny what they wrote — the hash is in their signed attestation |

### 15.8 Normative Rules

1. The Local App MUST compute `gate_content_hashes` at attestation time.
2. The hash for each gate MUST be computed from the exact text the owner entered.
3. `gate_content_hashes` MUST be included in the signed attestation payload.
4. The protocol MUST NOT require publication of gate content.
5. If gate content is published, verifiers MUST be able to independently compute the hash and compare.

---

## 16. AI Constraints & Gate Resolution

### 16.1 Drop In-Protocol AI Assistant

v0.3 removes the entire in-protocol AI assistant subsystem. The protocol enforces accountability, not thought purity. Users will consult external AI regardless — restricting in-protocol AI creates friction without preventing the behavior.

**Removed:**

- AI provider integrations (Ollama, OpenAI, Groq, Together)
- AI-driven alignment checking on gate closure
- AI-generated questions and follow-ups
- AI warning acknowledgment in commitment gate
- All `gate/*` SDGs (entry and follow-up questions)

### 16.2 Enforceable Constraints

The protocol enforces only what it can guarantee:

1. **Protocol does not supply content** — The Local App MUST NOT auto-generate or prefill gate fields. What the user brings from outside (including AI-assisted content) is their responsibility.

2. **Commitment requires explicit action** — A human must explicitly trigger gate closure and attestation. No automation.

3. **Gate resolution = presence only** — A gate closes when its field is non-empty. The protocol does not evaluate origin, adequacy, or correctness.

**What the protocol guarantees:** A human took responsibility by signing.

**What the protocol does not guarantee:** How they arrived at the content.

### 16.3 Gate Questions in Profile

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

### 16.4 Simplified SDGs

SDGs are reduced to structural checks only:

- `deploy/missing_decision_owner@1.0` — Hard stop
- `deploy/commitment_mismatch@1.0` — Hard stop
- `deploy/tradeoff_execution_mismatch@1.0` — Hard stop
- `deploy/objective_diff_mismatch@1.0` — Warning only

No SDG evaluates free-form text for correctness. Semantic rules (`always`, `semantic_mismatch`) are removed.

See [v0.3 AI Constraints Proposal](/doc/v0.3-ai-constraints.md) for full details.

---

## 17. Decision Streams

### 18.1 Motivation

Individual attestations are snapshots. They prove "someone decided X" but don't show how a project evolved through decisions. For public accountability and project history, we need to link attestations into a verifiable chain.

### 18.2 Stream Structure

Each attestation can optionally belong to a decision stream:

```json
{
  "stream": {
    "project_id": "hap-protocol",
    "sequence": 12,
    "previous_attestation_hash": "sha256:..."
  }
}
```

| Field | Purpose |
|-------|---------|
| `project_id` | Groups attestations into a project |
| `sequence` | Order within the stream (starts at 1) |
| `previous_attestation_hash` | Links to prior attestation (null for first) |

### 18.3 SP-Provided Timestamps

Timestamps come from the Service Provider, not the signer. This prevents backdating.

**Signer submits:** Attestation with no timestamp

**SP registers and returns:**

```json
{
  "attestation": { ... },
  "registered_at": 1735888005,
  "sp_signature": "..."
}
```

The SP certifies when it received the attestation. The signer cannot control this.

### 18.4 Ordering

Two ordering mechanisms:

1. **Sequence** — Logical order within a stream. Decision 3 came after decision 2.
2. **registered_at** — Wall-clock time from SP. When the attestation was actually registered.

Sequence is authoritative for chain order. Timestamp is authoritative for real-world time.

### 18.5 Normative Rules

1. `project_id` MUST be consistent across all attestations in a stream.
2. `sequence` MUST increment by 1 for each attestation in a stream.
3. `previous_attestation_hash` MUST reference the immediately prior attestation (or null for sequence 1).
4. The SP MUST set `registered_at` when receiving an attestation.
5. The SP MUST sign the registration to certify the timestamp.
6. Signers MUST NOT set timestamps — only the SP provides authoritative time.

### 18.6 Chain Verification

Anyone can verify a decision stream:

1. Fetch all attestations for a `project_id`
2. Order by `sequence`
3. Verify each `previous_attestation_hash` matches the prior attestation's hash
4. Verify SP signatures on registrations
5. If all checks pass → chain is valid and unbroken

### 18.7 Genesis Attestation

The first attestation in a stream:

- `sequence`: 1
- `previous_attestation_hash`: null

This is the genesis. All subsequent attestations link back to it.

---

## 18. SP Registration Requirements

### 18.1 SP Registries

The Service Provider MUST maintain:

**Profile Registry**
- Valid profiles and their versions
- Execution paths per profile
- Required domains per execution path
- Execution context schemas per domain

**Domain Authority Registry**
- Organizations registered with the SP
- Domain owners per organization (DID → domain mapping)
- Environment scopes per domain owner
- Authority grant/revoke timestamps

### 18.2 Organization Onboarding

Before any attestation can be issued, an organization MUST:

1. Register with at least one SP
2. Declare which profiles they will use
3. Register domain owners with their authorized domains and environments

### 18.3 SP Validation Rules

The SP MUST reject attestation requests when:

- Profile is not registered
- Requesting DID has no authority for claimed domain
- Domain is not required by the execution path
- Organization is not registered

### 18.4 Domain Authority Lifecycle

| Event | Action |
|-------|--------|
| New domain owner | Organization registers DID + domain + env with SP |
| Role change | Organization updates domain mapping |
| Departure | Organization revokes authority |
| Audit | SP provides authority history per DID |

---

## 19. Governance

### 19.1 SP Governance

Service Providers are trusted parties. Their governance must be explicit:

**SP Operators**
- Who operates the SP?
- What jurisdiction?
- What liability?

**SP Accountability**
- SPs MUST publish their signing public key
- SPs MUST log all attestations issued
- SPs SHOULD publish attestation counts and statistics
- SPs MUST NOT issue attestations without verifying domain authority

**SP Misbehavior**
- Issuing attestations for unauthorized DIDs → SP trust revocation
- Backdating timestamps → SP trust revocation
- Refusing valid requests → escalation path required

### 19.2 Multi-SP Ecosystem

The protocol supports multiple SPs:

- Organizations choose which SP(s) to use
- Verifiers can trust multiple SPs
- Attestations reference which SP signed them
- No single SP has monopoly on trust

**Interoperability:**
- SPs SHOULD use compatible attestation formats
- SPs MAY federate domain authority (SP-A trusts SP-B's authority registry)
- Cross-SP verification MUST be possible if both SPs are trusted

### 19.3 Profile Governance

**Profile Creation**
- Anyone can propose a profile
- Profiles SHOULD be reviewed before adoption
- Organizations decide which profiles to trust

**Profile Versioning**
- Breaking changes MUST bump major version
- SPs MUST support profile version negotiation
- Deprecated profiles SHOULD have sunset timeline

### 19.4 Domain Authority Governance

**Within Organizations:**
- Organization defines who grants domain authority
- Authority grants SHOULD require approval from existing authority holder
- Authority SHOULD have expiration (annual renewal)

**Audit Trail:**
- All authority grants/revocations MUST be logged
- Logs MUST include: who granted, to whom, which domain, when, expiration

### 19.5 Dispute Resolution

When attestation validity is disputed:

1. Verify cryptographic validity (signature, hashes)
2. Verify domain authority at time of attestation
3. Verify SP was trusted at time of attestation
4. If all valid → attestation stands
5. If authority was invalid → attestation is void, SP may be at fault

---

## 20. Open Questions

1. **Domain inheritance** — Can a domain "include" another domain's required fields?

2. **Attestation aggregation** — Should there be a way to combine multiple domain attestations into one signed bundle?

3. **Decision file validation** — Should the Local App validate the decision file against a JSON schema before allowing attestation?

4. **SP federation** — How do multiple SPs coordinate? Should there be a root trust anchor?

5. **Authority delegation** — Can a domain owner delegate authority temporarily? (e.g., vacation coverage)

6. **Cross-organization decisions** — How do multi-org projects handle domain authority?

---

## 21. Scope, Agents, and Future Work

### 21.1 The Core Principle

> Bounds flow down, never up. The root is always human.

HAP governs **human-defined bounds**. Agents execute within those bounds. The chain of authority always traces back to human attestation.

```
Human attests to bounds
    └── Agent executes within bounds
            └── Sub-agent executes within narrower sub-bounds
                    └── ...
```

Agents can narrow bounds (delegate with tighter constraints). Agents cannot widen bounds (grant themselves more authority).

### 21.2 Agent Workflows in v0.3

HAP already supports agent workflows:

| Component | Role |
|-----------|------|
| **Human** | Attests to execution context (the bounds) |
| **Agent** | Executes within those committed bounds |
| **Attestation** | Proves what bounds were authorized |

The execution context IS the pre-authorization. The agent is bound by what the human committed to.

**Example:**
```
Human attests:
  "For this deployment:
   - rollback if error rate > 1%
   - canary to 10% first
   - alert on anomaly"

Agent executes:
  Deploys, monitors, rolls back — all within attested bounds.

Audit shows:
  Human authorized these specific constraints.
```

### 21.3 What v0.3 Does Not Address

**High-frequency re-attestation**
- Real-time constraint updates at machine speed
- Batch attestation for thousands of micro-decisions

**Regulated Industry Requirements**
- Mandatory retention periods
- Informed consent verification
- Jurisdiction and data residency
- Industry-specific audit formats

**Advanced Multi-SP Scenarios**
- SP federation and trust anchors
- Cross-SP conflict resolution
- Decentralized trust models

### 21.4 Guidance for Regulated Industries

Organizations in regulated industries (healthcare, finance, safety-critical) should layer additional controls on top of HAP:

- **Retention:** Retain attestations for required periods (often 7+ years)
- **Disclosure:** If mandatory disclosure is required, do not rely on optional publication
- **Training:** Document that signers received appropriate training (outside HAP scope)
- **AI disclosure:** If regulations require AI involvement disclosure, track this separately

HAP provides accountability infrastructure. Compliance requires additional organizational controls.

### 21.4 Future Considerations (v0.4+)

| Topic | Description |
|-------|-------------|
| **Delegation model** | Human pre-authorizes AI/agent to act within bounds |
| **Batch attestation** | Attest to a class of actions, not each individual action |
| **Machine-readable schemas** | Formal JSON Schema for execution context validation |
| **Standing authority** | Long-lived attestations for repeated decision types |
| **SP federation** | Multiple SPs coordinating trust and authority |
| **Cross-org decisions** | Multi-organization projects with shared domains |

---

## 22. Next Steps

1. Review this proposal
2. Implement in demo (deploy-gate profile)
3. Validate with real multi-domain scenario
4. Finalize for v0.3 specification
