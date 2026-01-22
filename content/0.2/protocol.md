---
title: "Protocol"
version: "Version 0.2"
date: "January 2026"
---

AI systems increasingly execute tasks, optimize outcomes, and escalate actions without human intervention.
The central risk is no longer misalignment — it is direction drift:

**AI acting without human-defined direction: frame, problem, objective, tradeoff, commitment, and ownership.**

HAP prevents this by enforcing mandatory direction checkpoints.
Whenever AI detects ambiguity or missing human leadership, it must stop, ask, and wait until direction is re-established.

The Protocol does not produce answers.
It enforces the conditions under which answers may be acted upon.

---

## Why Direction Is the Last Human Scarcity

Automation makes execution abundant.
AI can generate options, simulate outcomes, and run any path.

What AI cannot do is create direction — because direction requires:

- **Frame** — setting the decision boundary
- **Problem** — justifying why to act
- **Objective** — choosing what to optimize
- **Tradeoff** — accepting what must be sacrificed
- **Commitment** — selecting a path and closing alternatives
- **Decision Owner** — the gate for valid decision-making

Commitment is the point of no return — where alternatives close and consequences become real.

Only humans can bear the cost of direction.
These six decision closure states are the irreducible human scarcity.

HAP exists to protect it.

---

## Limitations of Existing Approaches to AI Control

Most approaches to controlling advanced AI systems focus on behavior, oversight, or access, but fail to enforce **human authorship of consequential decisions**. They regulate how systems act, how organizations review outcomes, or who may initiate actions—without ensuring that irreversible execution is explicitly directed, justified, and owned by a human decision-maker. As AI systems operate at machine speed, these gaps allow direction to drift silently from humans to automation.

### Comparison with the Human Agency Protocol

| Approach | Primary Focus | Point of Intervention | Structural Limitation | How HAP Addresses It |
|---|---|---|---|---|
| **Alignment & Safety** | Model behavior | After objectives are set | Does not enforce who chose the objective or accepted consequences | **Objective & Tradeoff Gates** require explicit human choice before execution |
| **Governance & Policy** | Oversight and accountability | After harm occurs | Cannot block irreversible execution at machine speed | **Commitment Gate** blocks execution until a human makes a binding decision |
| **Access Control & Permissions** | Authorization | Before action, not justification | Allows actions without owned consequences | **Decision Owner Gate (+ Scope)** requires named, scoped human responsibility |
| **Sandboxing & Capability Limits** | Capability containment | System boundaries | Delays power without governing use or intent | **Frame Gate** enforces explicit decision boundaries and prevents context drift |
| **Human-Centered Design / "Slow AI"** | User reflection | Optional interaction points | Pauses are bypassed under pressure | **Stop → Ask → Confirm** makes direction checks mandatory |
| **Responsible AI Platforms** | Compliance documentation | Post-execution review | Creates audit trails without binding responsibility | **Cryptographic Attestation** proves gate closure before execution |

---

## Decision Closure States

All productive human decision-making requires resolving these states.
They are not sequential — they are conditions that must be satisfied before execution.

### **Frame — What's the decision boundary?**
Establishing what we're deciding about. Without this, AI has no context.

In v0.2, a Frame is a canonical, deterministic representation of:
- the action being authorized,
- the constraints under which it may occur,
- the execution context.

Frames are defined as key–value maps with deterministic canonicalization. Profiles define required keys, key semantics, and canonical ordering.

### **Problem — What's the justified reason to act?**
Every action requires justification. What problem makes this worth addressing?

### **Objective — What outcome are we optimizing for?**
AI can optimize anything, but only humans can choose what matters.

### **Tradeoff — What cost are we accepting?**
Every choice has a cost. What are we willing to sacrifice?

### **Commitment — What path have we selected?**
Commitment closes alternatives. This is the point of no return.

### **Decision Owner — Who takes responsibility?**
Execution creates consequences. Someone must own them.

AI must confirm all required states before execution.
No skipping, no inference, no automated assumption.

---

## Decision Ownership & Consequence Domains

> "No consequential action may be taken in a human system without an identifiable human who has explicitly authorized it, understood its tradeoffs, and accepted responsibility for its outcomes."

Ownership is not just a state — it is a **gate for valid decision-making**.

### The Decision Owner
A **Decision Owner** is any actor who:
1. Explicitly authorizes execution
2. Accepts responsibility for consequences
3. Declares the scope of authority within which that ownership is valid

A Decision Owner is invalid if the decision's declared consequences exceed their declared scope.

### Decision Owner Scope (DOS)

**Definition**
Decision Owner Scope describes the boundaries within which a human is authorized to make binding commitments. It is a declarative structure attached to the Decision Owner gate.

**v0.2 Schema**

Each entry in `decision_owner_scopes` binds a Decision Owner to their authorization scope:

```json
{
  "did": "did:key:...",
  "domain": "string",
  "env": "string"
}
```

- `did` — The Decision Owner's decentralized identifier
- `domain` — The organizational domain of authority (e.g., `engineering`, `security`, `release_management`). Profile-defined.
- `env` — The environment scope (e.g., `prod`, `staging`). Profile-defined.

Profiles define required scope combinations for each execution path.

### Consequence Domains
Consequences are partitioned by domain. Any actor materially affected in a domain must be a decision owner for that domain.

Common domains include:
- **Delivery** (Scope, timeline, quality)
- **Financial** (Budget, ROI, cost)
- **Legal** (Compliance, liability)
- **Reputational** (Brand, trust)
- **Wellbeing** (Burnout, safety)

### Multi-Owner Decisions
Decisions may have multiple owners.
However, collective or symbolic ownership ("The Team owns this") is invalid.
Ownership must be explicit, domain-scoped, and jointly committed.

**Invariant:** No decision frame may be committed unless all materially affected decision owners are identified and participating.

### Divergence Is Not Failure—False Unity Is

When materially affected parties issue conflicting attestations (e.g., different Frame hashes or incompatible tradeoffs), HAP blocks shared execution—not human agency.

This is not a deadlock. It is a boundary signal: "Your directions diverge."

Systems should respond by prompting users to:

"Your directions diverge. Initiate a new decision?"

This ensures drift is replaced by explicit divergence, preserving both autonomy and honesty. No shared action proceeds on unratified consensus.

#### Example: Product Release Decision

- **Frame:** "Release Feature X this quarter"
- **Engineering:** "I accept the cost of increased on-call load to ship by the deadline."
- **Legal:** "I accept the cost of delaying release until compliance review is complete."
- **Marketing:** "I accept the cost of reduced launch scope to meet campaign timing."

These tradeoffs are incompatible under the same Frame.
Shipping this quarter, delaying for compliance, and reducing scope imply mutually exclusive execution paths that cannot coexist. HAP detects this as tradeoff collision across consequence domains and blocks shared execution.

---

## Core Protocol Principle

HAP enforces direction before action.

Whenever direction is unclear or incomplete, AI must:

**Stop → Ask → Confirm → Proceed**

### **Stop**
AI detects missing or ambiguous decision states: frame, problem, objective, tradeoff, commitment, or decision owner.

### **Ask**
A structured inquiry is triggered to obtain missing direction.

### **Confirm**
The human resolves the checkpoint by providing clarity.

### **Proceed**
Only once commitment is resolved and validated may the AI act.

Every checkpoint is enforced.
Every commitment is logged.
Every action traces back to human direction.

---

## Profiles

v0.2 introduces **Profiles** as the mechanism for domain-specific enforcement.

A **Profile** defines:
- required frame keys,
- execution paths,
- disclosure schema,
- validation rules,
- executor constraints,
- TTL policies.

HAP Core is not enforceable without at least one trusted Profile.

Profiles are identified by `profile_id` and versioned independently.

### Profile-Defined TTL Policy

HAP Core does not fix attestation TTLs.

Each Profile MUST define:
- a default TTL
- a maximum TTL

Executor Proxies MUST enforce profile TTL limits. This prevents approval automation driven by time pressure.

### Execution Path Enforcement

If a Profile defines an `execution_paths` object, then:

1. Any attestation referencing that Profile MUST include an `execution_path` field in its payload.
2. The value of `execution_path` MUST exactly match one of the keys in the Profile's `execution_paths` object.
3. Executors and Service Providers MUST reject attestations that violate (1) or (2).

If a Profile does not define `execution_paths`, then:

1. The `execution_path` field MUST NOT appear in attestations.
2. Commitment is validated as a simple boolean closure (i.e., "commitment" is present in `resolved_gates`).

This ensures that execution paths are only used when pre-vetted, consequence-aware action templates exist—and never as free-form or ad-hoc declarations.

---

## Feedback Blueprints

Feedback Blueprints allow systems to report structural outcomes without revealing any semantic content.

Example:

```json
{
  "profile_id": "deploy-gate@0.2",
  "resolved_states": ["frame", "problem", "objective", "tradeoff", "commitment"],
  "missing_states": [],
  "execution_allowed": true,
  "stop_resolved": true
}
```

If `stop_resolved` is false, the AI may not proceed.

Feedback is strictly structural — counts, confirmations, transitions — never content.

---

## Signal Detection Guides

Local systems detect when direction is missing or degraded.

Guides define structural indicators such as:

- semantic drift
- contradictory purpose statements
- unresolved alternatives
- lack of explicit commitment
- missing decision owner

Example template:

```json
{
  "signal_intent": "missing_decision_owner",
  "observable_structures": ["affected_domains", "declared_owners"],
  "detection_rules": [
    "affected_domains > declared_owners"
  ],
  "confidence_threshold": 0.9,
  "stop_trigger": true
}
```

If a stop-trigger is raised, AI must halt and request direction.

---

## Frame Canonicalization

In v0.2, Frames follow strict canonicalization rules to ensure deterministic hashing.

HAP Core requires:
- UTF-8 encoding
- newline-delimited `key=value` records
- keys sorted lexicographically unless overridden by profile
- explicit inclusion of all required keys
- no whitespace normalization

**Key format**
Keys MUST match: `[a-z0-9_]+`

**Value encoding**
- Values MUST NOT contain newline (`\n`) characters.
- If a value contains `=` or any non-printable ASCII, it MUST be percent-encoded (RFC 3986) before frame construction.
- Profiles MAY further restrict allowed characters.

The canonical frame string is hashed to produce `frame_hash`.

---

## Human-Gated Actions

AI may not:

- interpret ambiguous framing
- infer the problem to solve
- choose optimization targets
- decide what tradeoffs to accept
- make commitments without explicit human choice
- execute without assigned responsibility

Actions require different state resolution based on risk:

| Action Type | Required States |
|:---|:---|
| Informational queries | Frame |
| Planning & analysis | Frame, Problem, Objective |
| Execution | All states (Frame, Problem, Objective, Tradeoff, Commitment, Decision Owner) |
| Public/irreversible actions | All states + explicit reconfirmation |

This enforces human leadership at the point of irreversibility.

---

## Attestations: Cryptographic Proof of Direction

An attestation is a short-lived, cryptographically signed proof that:

- A specific Frame (identified by frame_hash) was ratified
- All gates required by the Profile were closed
- All materially affected domains have explicit Decision Owners
- Approval occurred under a specific Profile

Attestations do not contain semantic content. They enable executors to verify direction without exposing intent.

### v0.2 Attestation Payload

```json
{
  "attestation_id": "uuid",
  "version": "0.2",
  "profile_id": "string",
  "frame_hash": "sha256:...",
  "resolved_gates": ["frame", "problem", "objective", "tradeoff", "commitment", "decision_owner"],
  "decision_owners": ["did:key:..."],
  "decision_owner_scopes": [
    {
      "did": "did:key:...",
      "domain": "engineering",
      "env": "prod"
    }
  ],
  "issued_at": 1735888000,
  "expires_at": 1735888120
}
```

Notes:
- `expires_at` remains part of Core v0.2.
- State-bound validity is intentionally deferred to v0.3.
- Core does not define execution semantics.

---

## Privacy Invariant

> **No semantic content leaves local custody by default or by protocol design.**

This includes (but is not limited to):
- source code
- diffs
- commit messages
- natural language descriptions
- rendered previews
- risk summaries

HAP MAY transmit cryptographic commitments (e.g., hashes), structural metadata, and signatures, but MUST NOT transmit semantic evidence to Service Providers or Executors.

Any disclosure of semantic content MUST be an explicit, human-initiated action outside the protocol.

Protocol data includes only:
- structural transitions
- confirmation counts
- stage completions
- commitment metadata

**No transcripts**
**No intent extraction**
**No user profiling**

The protocol makes authorship verifiable without exposing content.

---

## Roles

| Role | Responsibility |
|------|----------------|
| **Decision Owner** | Human accountable for the action |
| **Local App** | Presents information to the human and collects approval |
| **Service Provider (SP)** | Issues signed attestations |
| **Executor** | Executes the action; untrusted |
| **Executor Proxy** | Enforces HAP validation before execution |

Executors are always treated as **fully untrusted**.

### Decision Owner Authentication

Decision Owner authentication is out of scope for HAP Core. Implementations MUST establish identity through external mechanisms (e.g., OAuth, WebAuthn, hardware tokens, passkeys).

The Service Provider MUST NOT issue attestations without verifying Decision Owner identity through a trusted authentication channel.

---

## Threat Model

Implementations MUST assume:

- compromised Local App (blind-signing risk),
- malicious or buggy Executor,
- malicious or negligent Service Provider,
- profile and supply-chain attacks.

HAP does **not** assume trusted UIs, trusted executors, or honest automation.

---

## Gate Definitions

| Gate | Definition |
|------|------------|
| **Frame** | The canonical action representation exists and is well-formed according to the Profile schema |
| **Problem** | The human was presented with the reason this action is being requested (the "why") |
| **Objective** | The human was presented with the intended outcome of the action (the "what") |
| **Tradeoff** | The human was presented with risks, costs, or alternatives associated with the action |
| **Commitment** | The human explicitly confirmed intent to proceed (e.g., button click, signature) |
| **Decision Owner** | A qualified human identity is cryptographically bound to the approval |

Gate resolution is attested by the Service Provider based on signals from the Local App. Profiles define which gates are required and MAY specify additional verification requirements for each gate.

---

## The Decision Closure Loop

1. **State gap detected** — AI identifies missing or ambiguous decision state
2. **Targeted inquiry** — Request for specific state resolution
3. **Human resolves** — Human provides missing direction
4. **Closure evaluated** — System checks if all required states are resolved
5. **Execute or continue** — If closure achieved, AI proceeds; otherwise, loop continues
6. **Feedback emitted** — Structural confirmation logged

Order doesn't matter. Only closure matters.
Every action is traceable to complete human direction.

---

## Example Stop Event

**User:** "Help me deploy to production."

AI detects: unclear Problem, missing Objective, no Commitment → **Stop**

**AI:**
"What problem are you trying to solve — and what outcome matters most?"

**User:** "We need to ship the security fix before the deadline. I want to prevent the vulnerability from being exploited."

Problem and Objective confirmed.

**AI:**
"What path will you commit to — and what cost are you willing to accept?"

**User:** "I'll deploy to canary first. I accept that it might cause brief service degradation."

Tradeoff and Commitment recorded → **Proceed**

---

## Versioning Rules

- HAP Core versions (`0.x`) define protocol semantics.
- Profiles version independently.
- Breaking changes MUST bump major protocol or profile versions.
- Executors and Proxies MUST reject unknown or untrusted versions.

---

## Summary: What HAP Protects

In an automated world:

- Execution is cheap
- Options are infinite
- **Direction is scarce**

HAP protects the human role in defining direction by enforcing:

- **Frame** (decision boundary)
- **Problem** (justification)
- **Objective** (optimization target)
- **Tradeoff** (accepted cost)
- **Commitment** (binding choice)
- **Decision Owner** (responsibility)

These are not steps. They are closure conditions.

AI executes.
Humans decide what execution is for.

**HAP ensures automation serves human direction — not the reverse.**

---

## What's New in v0.2

- **Profiles** — Domain-specific enforcement rules
- **Frame Canonicalization** — Deterministic key-value format for hashing
- **Gate Definitions** — Clear semantics for each gate
- **Decision Owner Scopes** — Structured authorization boundaries with `did`, `domain`, `env`
- **TTL Policies** — Profile-defined attestation lifetimes
- **Threat Model** — Explicit assumptions about compromised components
- **Error Codes** — Structured Executor Proxy error responses

## Backward Compatibility

All fields introduced by the v0.2 extensions are optional unless required by a specific Profile. Systems implementing v0.1 concepts remain compatible; v0.2 adds structure without breaking existing semantics.
