---
title: "Protocol"
version: "Version 0.1"
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

> “No consequential action may be taken in a human system without an identifiable human who has explicitly authorized it, understood its tradeoffs, and accepted responsibility for its outcomes.”

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

**Minimal Schema**
```json
{
  "domains": ["delivery", "budget"],
  "constraints": {}
}
```

All fields are optional unless required by a Blueprint.

**Semantics**

Domains: Categories of consequence the owner is authorized to cover (e.g., delivery, financial, legal, reputational, wellbeing). Declared, not inferred.
Constraints: Optional limits on authority within a domain (e.g., budget cap, impact threshold). Compared structurally against declared decision consequences.

**Protocol Invariant (New)**

A Decision Owner is invalid if the decision's declared consequence scope exceeds the Decision Owner's declared scope.

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

#### Example: Product Release Decision (Non-Private, Widely Applicable)

- **Frame:** "Release Feature X this quarter"
- **Engineering:** "I accept the cost of increased on-call load to ship by the deadline."
- **Legal:** "I accept the cost of delaying release until compliance review is complete."
- **Marketing:** "I accept the cost of reduced launch scope to meet campaign timing."

These tradeoffs are incompatible under the same Frame.
Shipping this quarter, delaying for compliance, and reducing scope imply mutually exclusive execution paths that cannot coexist. HAP detects this as tradeoff collision across consequence domains and blocks shared execution.

Systems should respond by prompting users to:

"Your directions diverge. Initiate a new decision?"

This ensures drift is replaced by explicit divergence, preserving both autonomy and honesty. No shared action proceeds on unratified consensus.

---

## Core Protocol Principle

HAP enforces direction before action.

Whenever direction is unclear or incomplete, AI must:

**Stop → Ask → Commit → Proceed**

### **Stop**
AI detects missing or ambiguous decision states: frame, problem, objective, tradeoff, commitment, or decision owner.

### **Ask**
A structured Inquiry Blueprint is triggered to obtain missing direction.

### **Confirm**
The human resolves the checkpoint by providing clarity.

### **Proceed**
Only once commitment is resolved and validated may the AI act.

Every checkpoint is enforced.
Every commitment is logged.
Every action traces back to human direction.

---

## Inquiry Blueprints

An Inquiry Blueprint is a versioned, context-specific validation contract that defines the structural conditions a decision must satisfy to be actionable. It is not a prompt template—it is the rule set that gates execution.

Blueprints are published by context authorities (e.g., teams, cities, institutions) and embedded in HAP-compliant applications. Altering context rules requires a new Blueprint version.

Blueprint fields:

```json
{
  "id": "string",
  "intent": "string",
  "target_state": "frame|problem|objective|tradeoff|commitment|decision_owners",
  "required_domains": ["delivery", "budget", "legal"],
  "stop_conditions": ["frame", "commitment"],
  "constraints": {
    // Optional: semantic rules enforced LOCALLY by the app
    "frame_must_include": ["public_location"],
    "tradeoff_must_address": ["time_cost", "energy_cost"]
  },
  "render_hint": "string",
  "examples": ["string"]
}
```

Any HAP-compliant system must:

- Assign explicit Decision Owners to all required_domains
- Resolve all gates in stop_conditions before execution
- Enforce constraints during local gate resolution

Local AIs generate surface language privately; the protocol governs timing and necessity.

---

## Feedback Blueprints

Feedback Blueprints allow systems to report structural outcomes without revealing any semantic content.

Example:

```json
{
  "blueprint_id": "commitment-confirm",
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

## The Decision Closure Loop

1. **State gap detected** — AI identifies missing or ambiguous decision state
2. **Targeted inquiry** — Blueprint requests specific state resolution
3. **Human resolves** — Human provides missing direction
4. **Closure evaluated** — System checks if all required states are resolved
5. **Execute or continue** — If closure achieved, AI proceeds; otherwise, loop continues
6. **Feedback emitted** — Structural confirmation logged

Order doesn't matter. Only closure matters.
Every action is traceable to complete human direction.

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

## Attestations: Cryptographic Proof of Direction

An attestation is a short-lived, cryptographically signed proof that:

- A specific Frame (identified by frame_hash) was ratified
- All gates required by the Blueprint were closed
- All materially affected domains have explicit Decision Owners

Attestations do not contain semantic content. They enable executors to verify direction without exposing intent.

```json
{
  "header": { "typ": "HAP-attestation", "alg": "EdDSA" },
  "payload": {
    "frame_hash": "sha256:...",
    "blueprint_id": "string",
    "resolved_gates": ["frame", "problem", ...],
    "decision_owners": ["did:key:..."],
    "decision_owner_scopes": [
      {
        "owner_id": "did:key:...",
        "domains": ["delivery", "budget"],
        "constraints": { "budget_limit": "€25k" }
      }
    ],
    "affected_domains": ["wellbeing", "legal"],
    "issued_at": 1735888000,
    "expires_at": 1735888120
  }
}
```

Note: decision_owner_scopes is optional in the attestation unless required by the Blueprint. If present, the Executor Proxy must validate the scope invariant before execution.

---

## Privacy by Architecture

No semantic content ever leaves local custody.

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

## Service Providers

Service Providers enforce:

- blueprint validation
- schema fidelity
- stop-condition enforcement
- compliance proofs

They cannot access or store user content.
They do not own data or users.

They ensure the protocol is followed — not exploited.

---

## Governance

Governance is federated, lightweight, and proof-based.

A Provider loses qualification if it:

- allows AI to act without commitment
- bypasses required checkpoints
- infers meaning or purpose
- stores content
- trains on user data

Qualification requires:

- schema adherence
- privacy proofs
- stop-condition guarantees
- transparent logs

Direction integrity is enforced, not assumed.

---

## Example Stop Event

**User:** "Help me launch my product."

AI detects: unclear Problem, missing Objective, no Commitment → **Stop**

**AI (via Blueprint):**
"What problem are you trying to solve — and what outcome matters most?"

**User:** "Testing whether the core idea resonates. I want to learn, not optimize for revenue yet."

Problem and Objective confirmed.

**AI:**
"What path will you commit to — and what cost are you willing to accept?"

**User:** "I'll run a small paid test. I accept that it might fail and teach me nothing."

Tradeoff and Commitment recorded → **Proceed**

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

## Backward Compatibility

All fields introduced by the Decision Owner Scope extension are optional. Scope validation is only enforced when a Blueprint explicitly requires it or when decision_owner_scopes is present in the attestation request.

