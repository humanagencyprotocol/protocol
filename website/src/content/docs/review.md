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
| **Protocol** | Execution context structure, frame binding, attestation format | "Execution context must be immutably bound to the action" |
| **Profile** | How binding works in a specific context | "For GitHub PRs, declared fields live in `.hap/decision.json` in the commit" |

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

### 4.2 Execution Context Schema

The **profile defines the execution context schema**. Each profile specifies:
- What fields exist in the execution context
- How each field is resolved (declared vs computed)
- Which fields are required

```json
{
  "executionContextSchema": {
    "fields": {
      "execution_path": {
        "source": "declared",
        "description": "Governance level chosen by developer",
        "required": true
      },
      "repo": {
        "source": "action",
        "description": "Repository identifier",
        "required": true
      },
      "sha": {
        "source": "action",
        "description": "Commit SHA being authorized",
        "required": true
      },
      "changed_paths": {
        "source": "computed",
        "method": "git_diff",
        "description": "Files changed in this action"
      },
      "diff_url": {
        "source": "computed",
        "method": "constructed",
        "description": "Persistent link to the diff"
      }
    }
  }
}
```

**Field sources:**

| Source | Meaning | Example |
|--------|---------|---------|
| `declared` | Developer specifies in committed file | `execution_path` |
| `action` | Derived from the action being authorized | `repo`, `sha` |
| `computed` | System computes from deterministic sources | `changed_paths`, `diff_url` |

**Normative rules:**

1. Execution context MUST consist of deterministic, verifiable, and persistent values — either as direct content or as references to persistent sources.
2. All domain owners see the same execution context.
3. The execution context is hashed and included in the attestation.
4. Semantic content (problem, objective, tradeoffs) is entered by humans in gates, not in the execution context.
5. The `profile` field bootstraps everything — it determines which schema applies.

---

## 5. Execution Context

### 5.1 Definition

The **execution context** captures everything needed to authorize an action:

- **Governance choices** — declared by the developer (profile, execution_path)
- **Action facts** — derived from the action itself (repo, sha, changed_paths, diff_url)

The `profile` field is the bootstrap — it determines which schema defines the rest.

```json
{
  "profile": "deploy-gate@0.3",
  "execution_path": "deploy-prod-canary",

  "repo": "owner/repo",
  "sha": "abc123def456...",
  "changed_paths": ["src/api/auth.ts", "src/lib/crypto.ts"],
  "diff_url": "https://github.com/owner/repo/compare/base...head"
}
```

### 5.1.1 Two Parts, One Context

| Part | Source | Example Fields |
|------|--------|----------------|
| **Governance choices** | Declared in committed file | `profile`, `execution_path` |
| **Action facts** | Resolved by system | `repo`, `sha`, `changed_paths`, `diff_url` |

Both parts are deterministic, verifiable, and persistent. Together they form the complete execution context that gets hashed and attested to.

### 5.1.2 Why This Structure?

**Problem with semantic content in files:**
- Developers forget to update it → stale content
- Descriptions are unverifiable → trust issues

**Solution:**
- Declared fields = governance choices only (profile, execution_path)
- Resolved fields = computed from deterministic sources (git, action)
- Attestation captures the complete execution context (auditable record)

### 5.2 Binding Requirements

The execution context MUST be:

**Immutable** — The declared fields are committed with the action. The resolved fields are deterministic for a given action state.

**Bound to action** — How binding works is profile-specific. For deploy-gate, declared fields live in `.hap/decision.json` in the commit.

**Verifiable** — Anyone can re-resolve the execution context and compare to the attested hash.

### 5.3 Proposal Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. PROPOSER declares governance choices                                │
│     • Commits file with profile + execution_path                        │
│     • Binds to action (profile-specific mechanism)                      │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  2. SYSTEM resolves execution context                                   │
│     • Reads declared fields from committed file                         │
│     • Computes resolved fields from action (repo, sha, diff, etc.)      │
│     • Presents complete execution context to domain owners              │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  3. DOMAIN OWNERS review execution context                              │
│     • See complete context (governance choices + action facts)          │
│     • Validate: Is this the right governance level?                     │
│     • If they agree → attest                                            │
│     • If they disagree → don't attest, request changes                  │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  4. ALL REQUIRED DOMAINS attest to the same frame                       │
│     • Frame derived from action + execution context                     │
│     • All attestations share same frame_hash                            │
│     • Attestation includes execution_context_hash                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Disagreement Handling

If a domain owner disagrees with the proposal:

1. **Wrong execution path** — Domain owner refuses to attest. Proposer must update the declared execution context with the corrected path. New frame, new attestation cycle.

2. **Incomplete execution context** — Domain owner refuses to attest. Proposer must update the declared execution context with complete constraints.

3. **Inaccurate execution context** — Domain owner refuses to attest. Proposer must fix the issue and update the declared fields.

**No one can unilaterally override** — All required domains must attest to the same frame.

---

## 6. Frame Changes

### 6.1 Frame Derivation

A frame uniquely identifies an action and its execution context. The frame contains:

| Field | Source |
|-------|--------|
| `action_id` | Profile-specific action identifier |
| `profile` | From execution context |
| `path` | From execution context |
| `env` | From action context (optional) |

**v0.3 Frame structure (abstract):**

```
action_id=<profile-specific identifier>
profile=<profile-id>
path=<execution-path>
env=<environment>
```

The frame MUST be deterministically derivable from the action and execution context. If the declared execution context changes, the frame changes.

### 6.2 Remove `execution_context_hash` from Frame

**Rationale:** If the frame contains a single combined execution_context_hash, individual domain owners cannot independently prove what constraints they committed to without access to all domains' contexts. This breaks domain-scoped auditability.

Execution context binding moves to the attestation (per-domain).

### 6.3 No Condition Fields

v0.3 does **not** add condition fields to the frame.

**Rationale:** Self-declared conditions (e.g., "is this security-relevant?") are meaningless — the person who might want to skip oversight decides whether oversight is required. This is circular.

Instead, required domains are determined by **execution path** in the execution context — an explicit proposal validated by domain owners.

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

## 9. Execution Context Resolution

### 9.1 Resolution Flow

The execution context is **computed at processing time**, not stored in the decision file. This ensures determinism and traceability.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. DEVELOPER commits decision.json (minimal)                           │
│     • profile: "deploy-gate@0.3"                                        │
│     • execution_path: "deploy-prod-canary"                              │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  2. GITHUB APP receives webhook (PR created/updated)                    │
│     • Knows: owner, repo, base_sha, head_sha, PR number                 │
│     • Computes deterministic values from git                            │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  3. SYSTEM resolves execution context                                   │
│     • changed_paths: computed from git diff                             │
│     • diff_url: https://github.com/{owner}/{repo}/compare/{base}...{head}│
│     • sha: head commit                                                  │
│     • repo: from webhook context                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  4. ATTESTATION captures resolved values                                │
│     • frame_hash: commits to repo, sha, profile, path                   │
│     • execution_context_hash: commits to resolved context               │
│     • This IS the auditable record                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.2 What Gets Resolved

| Field | Source | Deterministic? |
|-------|--------|----------------|
| `repo` | Webhook context | ✓ Yes |
| `sha` | Head commit | ✓ Yes |
| `changed_paths` | `git diff --name-only base...head` | ✓ Yes |
| `diff_url` | Constructed from owner/repo/base/head | ✓ Yes |
| `profile` | From decision.json | ✓ Yes |
| `execution_path` | From decision.json | ✓ Yes |

All resolved values are deterministic — given the same PR state, the system always computes the same values.

### 9.3 Resolved Execution Context Structure

```json
{
  "repo": "owner/repo",
  "sha": "abc123def456...",
  "diff_url": "https://github.com/owner/repo/compare/base123...head456",
  "changed_paths": ["src/api/auth.ts", "src/lib/crypto.ts"],
  "profile": "deploy-gate@0.3",
  "execution_path": "deploy-prod-canary"
}
```

This resolved context is:
- Shown to domain owners in the UI (the Frame gate)
- Hashed and included in the attestation
- Fully verifiable by anyone with access to the repository

### 9.4 Execution Context Hash

The `execution_context_hash` in the attestation commits to the resolved context:

```typescript
const resolvedContext = {
  repo: "owner/repo",
  sha: "abc123...",
  diff_url: "https://...",
  changed_paths: ["src/api/auth.ts", ...],
  profile: "deploy-gate@0.3",
  execution_path: "deploy-prod-canary"
};

const executionContextHash = sha256(canonicalize(resolvedContext));
```

### 9.5 Traceability

The attestation IS the audit record. It contains:

- `frame_hash` → commits to what action was authorized
- `execution_context_hash` → commits to what context was shown/resolved
- `gate_content_hashes` → commits to what the human articulated (problem/objective/tradeoffs)

Anyone can verify: "This attestation commits to this exact context, derived from this exact PR state."

---

## 10. Error Codes

New error codes for v0.3:

| Code | Description |
|------|-------------|
| `MISSING_REQUIRED_DOMAIN` | A required domain has no valid attestation |
| `DOMAIN_SCOPE_MISMATCH` | Attestation domain/env doesn't match requirement |
| `EXECUTION_CONTEXT_VIOLATION` | Domain execution context missing required fields |
| `DECISION_RECORD_MISSING` | Action has no bound execution context declaration |
| `DECISION_RECORD_INVALID` | Declared execution context malformed or missing required fields |

---

## 11. Backward Compatibility

### What changes

- Frame no longer includes `execution_context_hash`
- Attestations include `resolved_domains` with per-domain `execution_context_hash`
- Execution paths explicitly define `requiredDomains`
- Execution context declared in committed file, resolved by system (binding is profile-specific)

### Migration path

- v0.2 attestations remain valid for v0.2 profiles
- v0.3 profiles require v0.3 attestations
- Executor Proxy checks `version` field and applies appropriate validation
- v0.3 requires declared execution context bound to action

---

## 12. Deploy-Gate Profile Binding

This section defines how the deploy-gate profile binds abstract protocol concepts to git-based workflows.

### 12.1 Execution Context Binding

For deploy-gate, the declared execution context is stored as `.hap/decision.json` in the commit:

- **Location:** `.hap/decision.json` in repository root
- **Content:** Governance choices only (profile + execution_path)
- **Binding:** Included in commit SHA (immutable)
- **Retrieval:** Via git or GitHub API

```json
{
  "profile": "deploy-gate@0.3",
  "execution_path": "deploy-prod-canary"
}
```

### 12.2 Context Resolution by GitHub App

The GitHub App resolves all deterministic values when processing the PR:

| Value | Resolution Method |
|-------|-------------------|
| `repo` | From webhook payload (`repository.full_name`) |
| `sha` | From webhook payload (`pull_request.head.sha`) |
| `base_sha` | From webhook payload (`pull_request.base.sha`) |
| `changed_paths` | GitHub API: `GET /repos/{owner}/{repo}/pulls/{number}/files` |
| `diff_url` | Constructed: `https://github.com/{owner}/{repo}/compare/{base}...{head}` |
| `profile` | From `.hap/decision.json` in commit |
| `execution_path` | From `.hap/decision.json` in commit |

### 12.3 Frame Binding

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

### 12.4 Demo Implementation Steps

**Step 1: Update Profile with execution paths**

- `deploy-prod-canary` → engineering only
- `deploy-prod-full` → engineering + release_management
- `deploy-prod-user-facing` → engineering + marketing

**Step 2: Declare execution context**

Developer adds `.hap/decision.json` to their commit with governance choices:
```json
{
  "profile": "deploy-gate@0.3",
  "execution_path": "deploy-prod-canary"
}
```

**Step 3: System resolves execution context**

On PR webhook:
1. Read declared fields from `.hap/decision.json`
2. Compute `changed_paths` from PR diff
3. Construct `diff_url` from base/head SHAs
4. Build complete execution context (declared + resolved)
5. Present to domain owners for attestation

**Step 4: Update Frame Gate UI**

- Show resolved execution context (computed by system)
- Display: changed files, diff link, execution path
- Show: "This path requires: Engineering" (from profile)
- Domain owners see the same information

**Step 5: Attestation captures resolved values**

1. Hash the resolved execution context
2. Include `execution_context_hash` in attestation
3. Attestation becomes the auditable record

**Step 6: Verification**

Anyone can verify:
1. Fetch `.hap/decision.json` from the commit
2. Re-compute the resolved context from git
3. Hash and compare to `execution_context_hash` in attestation
4. Match = attestation is valid for this exact PR state

---

## 13. Summary

| Aspect | v0.2 | v0.3 |
|--------|------|------|
| Declared content | Execution context with semantic fields | Governance choices only (profile + execution_path) |
| Execution context source | Entered in UI | Declared + system-resolved from action |
| Execution path selection | First attestor chooses | Proposer declares in committed file |
| Execution context hash | Single, in frame | Complete resolved context hash in attestation |
| Condition evaluation | N/A | None (explicit path choice) |
| Auditability | "Someone approved" | Attestation = auditable record with resolved context |
| Accountability | First attestor | Proposer declares, domains validate |

---

## 14. Design Decisions

### Why proposer declares in committed file?

If the first attestor chooses the execution path:

- They have disproportionate power over governance level
- Other domain owners must follow or refuse entirely
- No clear accountability for path selection

With proposer declaration:

- Proposer explicitly declares governance scope
- All domain owners validate the same proposal
- Clear accountability: proposer declares, domains validate
- Immutable binding to action

### Why system-resolved execution context?

Semantic content in declared files creates problems:

- Developers forget to update it → stale content
- Semantic descriptions are unverifiable → trust issues
- Content duplicates what's already in the PR → redundancy

With system-resolved execution context:

- Always deterministic — computed from action at processing time
- Always accurate — derived from the actual action state
- Fully verifiable — anyone can re-compute and compare
- Attestation captures the resolved values → immutable audit record

The declared file stays minimal (profile + execution_path). The system resolves all deterministic values. The attestation commits to the complete resolved context.

### Why no conditional domains?

Self-declared conditions (e.g., `security_relevant: true/false`) are meaningless:

- The person who might want to skip oversight decides whether oversight is required
- This is circular and easily gamed

Instead, governance scope is determined by **execution path** in the execution context:

- Explicit proposer declaration
- Validated by domain owners
- Clear accountability for choosing the wrong path

### Why shared execution context (all domains see the same)?

With per-domain execution context:

- Who decides what each domain sees? → governance problem
- Different views of the same change → confusion
- Content filtering is a form of interpretation → unverifiable

With shared, resolved execution context:

- All domain owners see the same deterministic data
- No content filtering or domain-specific views
- Each domain owner attests to the same frame + execution context
- Their gate content (problem/objective/tradeoffs) is domain-specific, but the context is shared

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

### 16.1 Enforceable Constraints

The protocol enforces only what it can guarantee:

1. **Protocol does not supply content** — The Local App MUST NOT auto-generate or prefill gate fields. What the user brings from outside (including AI-assisted content) is their responsibility.

2. **Commitment requires explicit action** — A human must explicitly trigger gate closure and attestation. No automation.

3. **Gate resolution = presence only** — A gate closes when its field is non-empty. The protocol does not evaluate origin, adequacy, or correctness.

**What the protocol guarantees:** A human took responsibility by signing.

**What the protocol does not guarantee:** How they arrived at the content.

### 16.2 Gate Questions in Profile

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

### 16.3 Simplified SDGs

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

### 21.5 Future Considerations (v0.4+)

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
